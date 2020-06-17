import { computeFolderHashes } from "util/files-and-folders/file-and-folders-utils";
import {
  AsyncWorkerEvent,
  createAsyncWorkerForChildProcess,
} from "util/async-worker/async-worker-util";
import { MessageTypes } from "../util/batch-process/batch-process-util-types";

const asyncWorker = createAsyncWorkerForChildProcess();

asyncWorker.addEventListener(
  AsyncWorkerEvent.MESSAGE,
  async ({ data: { hashes, filesAndFolders }, type }) => {
    if (type === MessageTypes.INITIALIZE) {
      try {
        // We batch the results to avoid overloading the main process
        const BATCH_SIZE = 500;
        let batchResult = {};
        const computeFolderHashHook = (hashObject) => {
          Object.assign(batchResult, hashObject);

          if (Object.keys(batchResult).length >= BATCH_SIZE) {
            asyncWorker.postMessage({
              type: MessageTypes.RESULT,
              result: batchResult,
            });
            batchResult = {};
          }
        };

        await computeFolderHashes(
          filesAndFolders,
          hashes,
          computeFolderHashHook
        );

        // flushing remaining results
        asyncWorker.postMessage({
          type: MessageTypes.RESULT,
          result: batchResult,
        });
      } catch (error) {
        asyncWorker.postMessage({ type: MessageTypes.ERROR, error });
      }

      asyncWorker.postMessage({ type: MessageTypes.COMPLETE });
      return;
    }

    asyncWorker.postMessage({ type: "unknown" });
  }
);

export default {};
