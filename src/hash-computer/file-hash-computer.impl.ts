import path from "path";
import { AsyncWorker } from "../util/async-worker-util";
import { MessageTypes } from "../util/batch-process/batch-process-util-types";
import { computeHash } from "../util/hash-util";

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
        error: { param, error: error.toString() },
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
