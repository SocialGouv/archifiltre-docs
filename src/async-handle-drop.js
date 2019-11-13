import LoadFromFilesystemFork from "./load-from-filesystem.fork";
import LoadFromJsonFork from "./load-from-json.fork";
import { isJsonFile } from "./util/file-sys-util";
import {
  AsyncWorkerEvent,
  createAsyncWorkerForChildProcessController
} from "./util/async-worker-util";

export default (hook, droppedElementPath) => {
  return new Promise((resolve, reject) => {
    const worker = isJsonFile(droppedElementPath)
      ? new LoadFromJsonFork()
      : new LoadFromFilesystemFork();

    const asyncWorker = createAsyncWorkerForChildProcessController(worker);
    asyncWorker.addEventListener(AsyncWorkerEvent.MESSAGE, event => {
      switch (event.data.status) {
        case "return":
          asyncWorker.terminate();
          resolve(event.data.vfs);
          break;
        case "error":
          asyncWorker.terminate();
          reject(event.data.message);
          break;
        default:
          hook(event.data);
      }
    });
    asyncWorker.postMessage({
      droppedElementPath
    });
  });
};
