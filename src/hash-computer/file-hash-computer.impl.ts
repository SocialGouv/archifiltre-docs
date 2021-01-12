import path from "path";
import { AsyncWorker } from "util/async-worker/async-worker-util";
import { MessageTypes } from "util/batch-process/batch-process-util-types";
import { computeHash } from "util/hash/hash-util";
import { createArchifiltreError } from "../reducers/loading-info/loading-info-selectors";
import { ArchifiltreErrorType } from "util/error/error-util";

let basePath;

/**
 * Computes the hashes and sends corresponding results to the main process
 * @param asyncWorker
 * @param paths - the paths for which to compute the hashes
 */
const computeHashBatch = (asyncWorker: AsyncWorker, paths: string[]) => {
  const result = paths.map((param) => {
    let hash;
    try {
      hash = computeHash(path.join(basePath, param));
    } catch (error) {
      hash = null;
      asyncWorker.postMessage({
        error: createArchifiltreError({
          filePath: param,
          code: error.code,
          reason: error.toString(),
          type: ArchifiltreErrorType.COMPUTING_HASHES,
        }),
        type: MessageTypes.ERROR,
      });
    }

    return {
      param,
      result: hash,
    };
  });

  asyncWorker.postMessage({ type: MessageTypes.RESULT, result });
};

/**
 * Handler for initialize message
 * @param asyncWorker
 * @param newBasePath
 */
export const onInitialize = (
  asyncWorker: AsyncWorker,
  { basePath: newBasePath }
) => {
  basePath = newBasePath;
};

/**
 * Handler for data event
 */
export const onData = computeHashBatch;
