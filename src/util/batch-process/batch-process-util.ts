import { cpus } from "os";
import { Observable } from "rxjs";
import { chunk } from "lodash";
import { reportError } from "../../logging/reporter";
import { makeEmptyArray } from "../array-util";
import { map } from "rxjs/operators";

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
      worker.postMessage({ type: "initialize", data: initialValues });
      if (onMessage) {
        worker.addEventListener("message", (message) => {
          onMessage(worker, message);
        });
      }
      worker.addEventListener("error", (error) =>
        // tslint:disable-next-line:no-console
        console.error("WorkerError", error)
      );
      return worker;
    });

export const computeBatch$ = (
  data: any,
  WorkerBuilder: any,
  {
    batchSize,
    initialValues,
  }: { batchSize: number; initialValues: InitWorkersData }
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
              type: "data",
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
          if (type === "result") {
            observer.next({ type, result });
            completed = completed + 1;
            if (completed === queueLength) {
              observer.complete();
              workers.forEach((workerElement) => workerElement.terminate());
            }
          }
          if (type === "error") {
            observer.next({ type, error: [error] });
          }
        }
      );
    });
  });
};

/**
 * Delegates work to a single worker. Progress will be piped in the returned Observable
 * @param processedData - The data processed. It will be sent to the worker in an "initialize" message.
 * @param WorkerBuilder - The Worker constructor.
 * @returns {Observable} - A rxjs observable piping progress.
 */
export const backgroundWorkerProcess$ = (
  processedData: any,
  WorkerBuilder: any
): Observable<any> =>
  new Observable((observer) => {
    const onMessage = (worker, { data: { type, result: data, error } }) => {
      switch (type) {
        case "result":
          observer.next(data);
          break;
        case "error":
          reportError(error);
          break;
        case "complete":
          worker.terminate();
          observer.complete();
          break;
        case "log":
          // tslint:disable-next-line:no-console
          console.log("Logging :", data);
          break;
        default:
          // tslint:disable-next-line:no-console
          console.log(`Unhandled message : ${type}`);
      }
    };
    initWorkers(WorkerBuilder, {
      onMessage,
      initialValues: processedData,
      workerCount: 1,
    });
  });

const aggregateToMap = (paramFieldName: string, resultFieldName: string) => (
  valuesArray: any[]
): object => {
  const valuesMap = {};
  for (const value of valuesArray) {
    valuesMap[value[paramFieldName]] = value[resultFieldName];
  }
  return valuesMap;
};

export const aggregateResultsToMap = aggregateToMap("param", "result");

export const aggregateErrorsToMap = aggregateToMap("param", "error");
