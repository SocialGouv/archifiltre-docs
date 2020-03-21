import { cpus } from "os";
import { Observable } from "rxjs";
import { chunk } from "lodash";
import { reportError } from "../../logging/reporter.ts";
import { makeEmptyArray } from "../array-util";
import { map } from "rxjs/operators";

// We create NB_CPUS - 1 processes to optimize computation
const NB_CPUS = cpus().length - 1 > 0 ? cpus().length - 1 : 1;

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
  WorkerBuilder,
  { onMessage, initialValues, workerCount = NB_CPUS }
) =>
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
        console.error("WorkerError", error)
      );
      return worker;
    });

export const computeBatch$ = (
  data,
  WorkerBuilder,
  { batchSize, initialValues }
) => {
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
        map((worker) => {
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
              workers.forEach((worker) => worker.terminate());
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
 * @param data - The data processed. It will be sent to the worker in an "initialize" message.
 * @param WorkerBuilder - The Worker constructor.
 * @returns {Observable} - A rxjs observable piping progress.
 */
export const backgroundWorkerProcess$ = (data, WorkerBuilder) => {
  return new Observable((observer) => {
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
          console.log("Logging :", data);
          break;
        default:
          console.log(`Unhandled message : ${type}`);
      }
    };
    initWorkers(WorkerBuilder, {
      onMessage,
      initialValues: data,
      workerCount: 1,
    });
  });
};

const aggregateToMap = (paramFieldName, resultFieldName) => (valuesArray) => {
  const valuesMap = {};
  for (let index = 0; index < valuesArray.length; index++) {
    const currentValue = valuesArray[index];
    valuesMap[currentValue[paramFieldName]] = currentValue[resultFieldName];
  }
  return valuesMap;
};

export const aggregateResultsToMap = aggregateToMap("param", "result");

export const aggregateErrorsToMap = aggregateToMap("param", "error");
