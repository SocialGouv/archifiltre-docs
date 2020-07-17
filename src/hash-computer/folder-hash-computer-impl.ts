import { AsyncWorker } from "util/async-worker/async-worker-util";
import { HashesMap } from "reducers/hashes/hashes-types";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { MessageTypes } from "util/batch-process/batch-process-util-types";
import { computeFolderHashes } from "util/files-and-folders/file-and-folders-utils";

const BATCH_SIZE = 500;

type OnInitializeParams = {
  hashes: HashesMap;
  filesAndFolders: FilesAndFoldersMap;
};

export const onInitialize = async (
  asyncWorker: AsyncWorker,
  { hashes, filesAndFolders }: OnInitializeParams
) => {
  try {
    let batchResult: HashesMap = {};

    const computeFolderHashesHook = (hashObject: HashesMap) => {
      Object.assign(batchResult, hashObject);

      if (Object.keys(batchResult).length >= BATCH_SIZE) {
        asyncWorker.postMessage({
          result: batchResult,
          type: MessageTypes.RESULT,
        });
        batchResult = {};
      }
    };

    await computeFolderHashes(filesAndFolders, hashes, computeFolderHashesHook);

    asyncWorker.postMessage({
      result: batchResult,
      type: MessageTypes.RESULT,
    });
  } catch (error) {
    asyncWorker.postMessage({ error, type: MessageTypes.ERROR });
  }

  asyncWorker.postMessage({ type: MessageTypes.COMPLETE });
};
