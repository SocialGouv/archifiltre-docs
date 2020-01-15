import path from "path";
import { computeHash } from "../util/hash-util";
import {
  AsyncWorkerEvent,
  createAsyncWorkerForChildProcess
} from "../util/async-worker-util";

const asyncWorker = createAsyncWorkerForChildProcess();

asyncWorker.postMessage({ type: "running" });

let basePath;

/**
 * Computes the hashes and sends corresponding results to the main process
 * @param paths - the paths for which to compute the hashes
 */
const computeHashBatch = paths => {
  const result = paths.map(param => {
    let hash;
    try {
      hash = computeHash(path.join(basePath, param));
    } catch (error) {
      hash = null;
      asyncWorker.postMessage({
        type: "error",
        error: { param, error: error.toString() }
      });
    }

    return {
      param,
      result: hash
    };
  });

  asyncWorker.postMessage({ type: "result", result });
};

asyncWorker.addEventListener(AsyncWorkerEvent.MESSAGE, ({ data, type }) => {
  switch (type) {
    case "initialize":
      ({ basePath } = data);
      break;

    case "data":
      computeHashBatch(data);
      break;

    default:
      asyncWorker.postMessage({ type: "unknown" });
  }
});

export default {};
