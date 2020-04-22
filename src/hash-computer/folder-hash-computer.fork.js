import { computeFolderHashes } from "util/files-and-folders/file-and-folders-utils";
import {
  AsyncWorkerEvent,
  createAsyncWorkerForChildProcess,
} from "util/async-worker/async-worker-util";

const asyncWorker = createAsyncWorkerForChildProcess();

asyncWorker.addEventListener(
  AsyncWorkerEvent.MESSAGE,
  ({ data: { hashes, filesAndFolders }, type }) => {
    if (type === "initialize") {
      try {
        // We batch the results to avoid overloading the main process
        const BATCH_SIZE = 500;
        let batchResult = {};
        const computeFolderHashHook = (hashObject) => {
          batchResult = { ...batchResult, ...hashObject };

          if (Object.keys(batchResult).length === BATCH_SIZE) {
            asyncWorker.postMessage({ type: "result", result: batchResult });
            batchResult = {};
          }
        };

        computeFolderHashes(filesAndFolders, hashes, computeFolderHashHook);

        // flushing remaining results
        asyncWorker.postMessage({ type: "result", result: batchResult });
      } catch (error) {
        asyncWorker.postMessage({ type: "error", error });
      }

      asyncWorker.postMessage({ type: "complete" });
      return;
    }

    asyncWorker.postMessage({ type: "unknown" });
  }
);

export default {};
