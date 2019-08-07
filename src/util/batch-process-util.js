import { makeEmptyArray } from "./array-util.ts";
import { cpus } from "os";
import { Observable } from "rxjs";
import { reportError } from "../reporter";

// We create NB_CPUS - 1 processes to optimize computation
const NB_CPUS = cpus().length - 1 > 0 ? cpus().length - 1 : 1;

/**
 * Get next batch of data to process
 * @param array - The full dataSet to process
 * @param batchSize - The number of element to take from the dataSet
 * @returns {Array} - The next dataSet part to process
 */
const getNextBatch = (array, batchSize) => {
  return array.slice(0, batchSize);
};

/**
 * Get the dataset without the next set to process
 * @param array - The full dataSet to process
 * @param batchSize - The number of element to take from the dataSet
 * @returns {Array} - The remaining dataSet to process
 */
const removeNextBatch = (array, batchSize) => {
  return array.slice(batchSize);
};

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
    .map(worker => {
      worker.postMessage({ type: "initialize", data: initialValues });
      worker.addEventListener("message", message => {
        onMessage(worker, message);
      });
      worker.addEventListener("error", error =>
        console.error("WorkerError", error)
      );
      return worker;
    });

export const computeBatch$ = (
  data,
  WorkerBuilder,
  { batchSize, initialValues }
) => {
  return new Observable(observer => {
    let remainingData = data;
    let runningWorkersCount = 0;

    const elementProcessed = worker => {
      runningWorkersCount = runningWorkersCount - 1;
      if (remainingData.length !== 0) {
        processNext(worker);
      } else {
        if (runningWorkersCount === 0) {
          observer.complete();
        }
      }
    };

    const onMessage = (worker, { data: { type, result: data, error } }) => {
      switch (type) {
        case "result":
          observer.next(data);
          elementProcessed(worker);
          break;

        case "error":
          reportError(error);
          elementProcessed(worker);
          break;

        default:
          console.log(`Unhandled message : ${type}`);
      }
    };

    const processNext = worker => {
      const dataToProcess = getNextBatch(remainingData, batchSize);
      if (dataToProcess.length <= 0) {
        worker.terminate();
        return;
      }
      remainingData = removeNextBatch(remainingData, batchSize);
      runningWorkersCount = runningWorkersCount + 1;
      worker.postMessage({ type: "data", data: dataToProcess });
    };

    const workers = initWorkers(WorkerBuilder, { onMessage, initialValues });

    workers.map(worker => processNext(worker));
  });
};

/**
 * Delegates work to a single worker. Progress will be piped in the returned Observable
 * @param data - The data processed. It will be sent to the worker in an "initialize" message.
 * @param WorkerBuilder - The Worker constructor.
 * @returns {Observable} - A rxjs observable piping progress.
 */
export const backgroundWorkerProcess$ = (data, WorkerBuilder) => {
  return new Observable(observer => {
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
      workerCount: 1
    });
  });
};

export const aggregateResultsToMap = result => {
  return result.reduce((acc, { param, result }) => {
    return {
      ...acc,
      [param]: result
    };
  }, {});
};
