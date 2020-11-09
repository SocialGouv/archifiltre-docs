import { chunk } from "lodash";
import { cpus } from "os";
import { fromEvent, merge, Observable, Subject } from "rxjs";
import { reportError } from "logging/reporter";
import { makeEmptyArray } from "util/array/array-util";
import { filter, map, take, takeWhile, tap } from "rxjs/operators";
import {
  ErrorMessage,
  MessageTypes,
  ReadyMessage,
  ResultMessage,
  WorkerMessage,
} from "util/batch-process/batch-process-util-types";
import workerManager, {
  ChildProcessConstructor,
} from "util/worker-manager/worker-manager";
import {
  ProcessControllerAsyncWorker,
  WorkerEventType,
} from "util/async-worker/async-worker-util";

// We create NB_CPUS - 1 processes to optimize computation
const NB_CPUS = cpus().length - 1 > 0 ? cpus().length - 1 : 1;

interface InitWorkersData {
  onMessage?: (worker: any, data: any) => void;
  initialValues?: any;
  workerCount?: number;
}

type MessageAndWorker<MessageType = WorkerMessage> = {
  message: MessageType;
  worker: ProcessControllerAsyncWorker;
};

type InitWorkersResult = {
  result$: Observable<MessageAndWorker>;
  terminate: () => void;
};

const spawnWorkers = (
  WorkerBuilder: ChildProcessConstructor,
  count = NB_CPUS
): ProcessControllerAsyncWorker[] =>
  makeEmptyArray(count, null).map(() => workerManager.spawn(WorkerBuilder));

export const setupWorkers$ = (
  workers: ProcessControllerAsyncWorker[],
  initialValues: any
) => {
  const result$ = merge(
    ...workers
      .map((worker) => {
        worker.addEventListener(WorkerEventType.ERROR, (error) =>
          reportError({ type: "WorkerError", error })
        );
        worker.postMessage({
          type: MessageTypes.INITIALIZE,
          data: initialValues,
        });
        return worker;
      })
      .map(
        (worker): Observable<MessageAndWorker> =>
          (fromEvent(worker, WorkerEventType.MESSAGE) as Observable<
            WorkerMessage
          >).pipe(
            tap(({ type }) => {
              if (type === MessageTypes.COMPLETE) {
                worker.terminate();
              }
            }),
            takeWhile(({ type }) => type !== MessageTypes.COMPLETE),
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

export const initWorkers$ = (
  WorkerBuilder: ChildProcessConstructor,
  { initialValues, workerCount = NB_CPUS }: InitWorkersData
): InitWorkersResult => {
  const workers = spawnWorkers(WorkerBuilder, workerCount);

  return setupWorkers$(workers, initialValues);
};

const filterResultsErrorsAndReady = (
  param: MessageAndWorker
): param is MessageAndWorker<ResultMessage | ReadyMessage | ErrorMessage> =>
  [MessageTypes.READY, MessageTypes.RESULT, MessageTypes.ERROR].includes(
    param.message.type
  );

const filterResultsAndErrors = (
  message: WorkerMessage
): message is ResultMessage | ErrorMessage =>
  message.type === MessageTypes.RESULT || message.type === MessageTypes.ERROR;

export const processQueueWithWorkers = (
  results$: Observable<MessageAndWorker>,
  data: any[],
  batchSize: number
) => {
  const queue = chunk(data, batchSize);
  const queueLength = queue.length;

  const subject = new Subject();

  results$
    .pipe(
      filter(filterResultsErrorsAndReady),
      tap(({ worker, message }) => {
        if (queue.length > 0) {
          worker.postMessage({ type: MessageTypes.DATA, data: queue.shift() });
        }
      })
    )
    .subscribe((data) => subject.next(data));

  return subject.pipe(
    map(({ message }) => message),
    filter(filterResultsAndErrors),
    take(queueLength)
  );
};

export const computeBatch$ = (
  data: any,
  WorkerBuilder: ChildProcessConstructor,
  { batchSize, initialValues }: { batchSize: number; initialValues: any }
): Observable<any> => {
  const { result$ } = initWorkers$(WorkerBuilder, { initialValues });

  return processQueueWithWorkers(result$, data, batchSize);
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
  WorkerBuilder: ChildProcessConstructor
): Observable<ResultMessage | ErrorMessage> =>
  cancelableBackgroundWorkerProcess$(processedData, WorkerBuilder).result$;

type CancelableBackgroundWorkerProcessResult = {
  result$: Observable<ResultMessage | ErrorMessage>;
  terminate: () => void;
};

export const cancelableBackgroundWorkerProcess$ = (
  processedData: any,
  WorkerBuilder: ChildProcessConstructor
): CancelableBackgroundWorkerProcessResult => {
  const { result$, terminate } = initWorkers$(WorkerBuilder, {
    initialValues: processedData,
    workerCount: 1,
  });
  const processedResult$ = result$.pipe(
    map(({ message }) => message),
    onMessageType(MessageTypes.ERROR, (message) => {
      reportError(message.error);
    }),
    onMessageType(MessageTypes.LOG, (message) => {
      console.log("Logging :", message.data);
    }),
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
