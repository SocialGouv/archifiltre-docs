import {
  AsyncWorkerEvent,
  createAsyncWorkerForChildProcess,
} from "util/async-worker/async-worker-util";
import { computeFolderHashes } from "util/files-and-folders/file-and-folders-utils";

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
              result: batchResult,
              type: MessageTypes.RESULT,
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
          result: batchResult,
          type: MessageTypes.RESULT,
        });
      } catch (error) {
        asyncWorker.postMessage({ error, type: MessageTypes.ERROR });
      }

      asyncWorker.postMessage({ type: MessageTypes.COMPLETE });
      return;
    }

    asyncWorker.postMessage({ type: "unknown" });
  }
);

export default {};
