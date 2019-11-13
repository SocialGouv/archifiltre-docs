import path from "path";
import { computeHash } from "../util/hash-util";
import {
  AsyncWorkerEvent,
  createAsyncWorkerForChildProcess
} from "../util/async-worker-util";

const asyncWorker = createAsyncWorkerForChildProcess();

asyncWorker.postMessage({ type: "running" });

let basePath;

asyncWorker.addEventListener(AsyncWorkerEvent.MESSAGE, ({ data, type }) => {
  switch (type) {
    case "initialize":
      ({ basePath } = data);
      break;

    case "data":
      try {
        const result = data.map(param => ({
          param,
          result: computeHash(path.join(basePath, param))
        }));
        asyncWorker.postMessage({ type: "result", result });
      } catch (error) {
        asyncWorker.postMessage({ type: "error", error });
      }
      break;

    default:
      asyncWorker.postMessage({ type: "unknown" });
  }
});

export default {};
