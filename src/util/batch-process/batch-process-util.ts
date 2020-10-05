import { chunk } from "lodash";
import { cpus } from "os";
import { fromEvent, merge, Observable } from "rxjs";
import { reportError } from "logging/reporter";
import { makeEmptyArray } from "util/array/array-util";
import { filter, map, takeWhile, tap } from "rxjs/operators";
import {
  ErrorMessage,
  MessageTypes,
  ResultMessage,
  WorkerMessage,
} from "util/batch-process/batch-process-util-types";

// We create NB_CPUS - 1 processes to optimize computation
const NB_CPUS = cpus().length - 1 > 0 ? cpus().length - 1 : 1;

interface InitWorkersData {
  onMessage?: (worker: any, data: any) => void;
  initialValues?: any;
  workerCount?: number;
}

/**
 *
 * @param WorkerBuilder- The function to build the worker
 * @param onMessage - The message callback
 * @param initialValues - The initial values to send to the worker
 * @param [workerCount = NB_CPUS - 1] - The number of workers to spawn.
 * Defaults to the number of CPUs - 1 or 1 if you only have a single core computer
 * @returns {Array<Worker>} - The list of the workers
 */
const initWorkers = (
  WorkerBuilder: any,
  { onMessage, initialValues, workerCount = NB_CPUS }: InitWorkersData
): Worker[] =>
  makeEmptyArray(workerCount, null)
    .map(() => new WorkerBuilder())
    .map((worker) => {
      worker.postMessage({
        type: MessageTypes.INITIALIZE,
        data: initialValues,
      });
      if (onMessage) {
        worker.addEventListener("message", (message) => {
          onMessage(worker, message);
        });
      }
      worker.addEventListener("error", (error) =>
        console.error("WorkerError", error)
      );
      return worker;
    });

type InitWorkersResult = {
  result$: Observable<{ worker: Worker; message: WorkerMessage }>;
  terminate: () => void;
};

const initWorkers$ = (
  WorkerBuilder: any,
  { initialValues, workerCount = NB_CPUS }: InitWorkersData
): InitWorkersResult => {
  const workers = makeEmptyArray(workerCount, null).map(
    () => new WorkerBuilder()
  );

  const result$ = merge(
    ...workers
      .map((worker) => {
        worker.addEventListener("error", (error) =>
          reportError({ type: "WorkerError", error })
        );
        worker.postMessage({ type: "initialize", data: initialValues });
        return worker;
      })
      .map(
        (worker): Observable<{ worker: Worker; message: WorkerMessage }> =>
          fromEvent(worker, "message")
            .pipe(
              tap(({ type }) => {
                if (type === MessageTypes.COMPLETE) {
                  worker.terminate();
                }
              })
            )
            .pipe(takeWhile(({ type }) => type !== MessageTypes.COMPLETE))
            .pipe(
              map((message: WorkerMessage) => ({
                worker,
                message,
              }))
            )
      )
  );
  const terminate = () => {
    workers.forEach((worker) => worker.terminate());
  };
  return { result$, terminate };
};

export const computeBatch$ = (
  data: any,
  WorkerBuilder: any,
  { batchSize, initialValues }: { batchSize: number; initialValues: any }
): Observable<any> => {
  const workers = initWorkers(WorkerBuilder, { initialValues });

  /**
   * Observable that emits when a worker is available.
   * @type {Observable<Worker>}
   */
  const workerAvailable$ = new Observable((observer) => {
    workers.map((worker) => {
      worker.addEventListener("message", ({ data: { type } }) => {
        if (type === "result") {
          observer.next(worker);
        }
      });
      observer.next(worker);
    });
  });

  const queue = chunk(data, batchSize);
  const queueLength = queue.length;

  return new Observable((observer) => {
    let completed = 0;
    workerAvailable$
      .pipe(
        map((worker: Worker) => {
          if (queue.length > 0) {
            const sentData = queue.shift();
            worker.postMessage({
              type: MessageTypes.DATA,
              data: sentData,
            });
          }
        })
      )
      .subscribe();

    workers.map((worker) => {
      worker.addEventListener(
        "message",
        ({ data: { type, result, error } }) => {
          if (type === MessageTypes.RESULT) {
            observer.next({ type, result });
            completed = completed + 1;
            if (completed === queueLength) {
              observer.complete();
              workers.forEach((workerElement) => workerElement.terminate());
            }
          }
          if (type === MessageTypes.ERROR) {
            observer.next({ type, error: [error] });
          }
        }
      );
    });
  });
};

type LookUp<U, T> = U extends { type: T } ? U : never;

const onMessageType = <T extends MessageTypes>(
  type: T,
  effect: (message: LookUp<WorkerMessage, T>) => void
) =>
  tap((message: WorkerMessage) => {
    if (message.type === type) {
      effect(message as LookUp<WorkerMessage, T>);
    }
  });

/**
 * Delegates work to a single worker. Progress will be piped in the returned Observable
 * @param processedData - The data processed. It will be sent to the worker in an "initialize" message.
 * @param WorkerBuilder - The Worker constructor.
 * @returns {Observable} - A rxjs observable piping progress.
 */
export const backgroundWorkerProcess$ = (
  processedData: any,
  WorkerBuilder: any
): Observable<ResultMessage | ErrorMessage> =>
  cancelableBackgroundWorkerProcess$(processedData, WorkerBuilder).result$;

type CancelableBackgroundWorkerProcessResult = {
  result$: Observable<ResultMessage | ErrorMessage>;
  terminate: () => void;
};

export const cancelableBackgroundWorkerProcess$ = (
  processedData: any,
  WorkerBuilder: any
): CancelableBackgroundWorkerProcessResult => {
  const { result$, terminate } = initWorkers$(WorkerBuilder, {
    initialValues: processedData,
    workerCount: 1,
  });
  const processedResult$ = result$
    .pipe(map(({ message }) => message))
    .pipe(
      onMessageType(MessageTypes.ERROR, (message) => {
        reportError(message.error);
      })
    )
    .pipe(
      onMessageType(MessageTypes.LOG, (message) => {
        console.log("Logging :", message.data);
      })
    )
    .pipe(
      filter<WorkerMessage, ErrorMessage | ResultMessage>(
        (message: WorkerMessage): message is ResultMessage | ErrorMessage =>
          message.type === MessageTypes.RESULT ||
          message.type === MessageTypes.ERROR
      )
    );
  return { result$: processedResult$, terminate };
};

export type BatchProcessResult<T> = {
  param: string;
  result: T;
};

export type BatchProcessError = {
  param: string;
  error: any;
};

type AggregatedResult<T> = {
  [key: string]: T;
};

export const aggregateResultsToMap = <T>(
  results: BatchProcessResult<T>[]
): AggregatedResult<T> => {
  const valuesMap: AggregatedResult<T> = {};

  return results
    .map((result: BatchProcessResult<T>) => ({ [result.param]: result.result }))
    .reduce(
      (aggregatedResult: AggregatedResult<T>, result: AggregatedResult<T>) =>
        Object.assign(aggregatedResult, result),
      valuesMap
    );
};

export const aggregateErrorsToMap = (
  errors: BatchProcessError[]
): AggregatedResult<any> => {
  const valuesMap: AggregatedResult<any> = {};

  return errors
    .map((result: BatchProcessError) => ({ [result.param]: result.error }))
    .reduce(
      (
        aggregatedResult: AggregatedResult<any>,
        result: AggregatedResult<any>
      ) => Object.assign(aggregatedResult, result),
      valuesMap
    );
};

export const filterResults = () =>
  filter(
    (message: WorkerMessage): message is ResultMessage =>
      message.type === MessageTypes.RESULT
  );
