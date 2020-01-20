import LoadFromFilesystemFork from "./load-from-filesystem.fork";
import LoadFromJsonFork from "./load-from-json.fork";
import { isJsonFile } from "./util/file-sys-util";
import {
  AsyncWorkerEvent,
  createAsyncWorkerForChildProcessController
} from "./util/async-worker-util";
import { reportError, reportInfo, reportWarning } from "./logging/reporter";
import { MessageTypes } from "./util/batch-process/batch-process-util-types";

export default (hook, droppedElementPath) => {
  return new Promise((resolve, reject) => {
    const worker = isJsonFile(droppedElementPath)
      ? new LoadFromJsonFork()
      : new LoadFromFilesystemFork();

    const asyncWorker = createAsyncWorkerForChildProcessController(worker);
    asyncWorker.addEventListener(AsyncWorkerEvent.MESSAGE, event => {
      switch (event.data.type) {
        case MessageTypes.COMPLETE:
          reportInfo({
            path: droppedElementPath,
            type: "elementLoadedSuccessfully"
          });
          asyncWorker.terminate();
          resolve(event.data.message.vfs);
          break;
        case MessageTypes.FATAL:
          asyncWorker.terminate();
          reject(event.data.message);
          reportError(event.data.message);
          break;
        case MessageTypes.ERROR:
          reportError(event.data.message);
          break;
        case MessageTypes.WARNING:
          reportWarning(event.data.message);
          break;
        case MessageTypes.RESULT:
          hook(event.data.message);
          break;
        default:
          hook(event.data);
      }
    });

    reportInfo({ path: droppedElementPath, type: "elementDropped" });
    asyncWorker.postMessage({
      droppedElementPath
    });
  });
};
