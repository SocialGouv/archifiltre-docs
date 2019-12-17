import {
  aggregateResultsToMap,
  backgroundWorkerProcess$,
  computeBatch$
} from "../util/batch-process/batch-process-util";

import FileHashFork from "./file-hash-computer.fork.js";
import FolderHashFork from "./folder-hash-computer.fork.js";

import { bufferTime, map, filter } from "rxjs/operators";
import { createAsyncWorkerControllerClass } from "../util/async-worker-util";

const BATCH_SIZE = 500;
const BUFFER_TIME = 1000;

/**
 * Returns an observable that will dispatch computed hashes every second
 * @param paths - The paths of the files
 * @param basePath - The base Path of the files.
 * @returns {Observable<{}>}
 */
export const computeHashes$ = (paths, { initialValues: { basePath } }) => {
  const FileHashWorker = createAsyncWorkerControllerClass(FileHashFork);
  const hashes$ = computeBatch$(paths, FileHashWorker, {
    batchSize: BATCH_SIZE,
    initialValues: { basePath }
  });
  return hashes$
    .pipe(map(aggregateResultsToMap))
    .pipe(bufferTime(BUFFER_TIME))
    .pipe(filter(buffer => buffer.length !== 0))
    .pipe(map(bufferedObjects => Object.assign({}, ...bufferedObjects)));
};

/**
 * Returns an observable that will dispatch computed hashes every second
 * @param filesAndFolders - The filesAndFolders
 * @param hashes - The precomputed folder hashes
 * @returns {Observable<{}>}
 */
export const computeFolderHashes$ = ({ filesAndFolders, hashes }) => {
  const FolderHashWorker = createAsyncWorkerControllerClass(FolderHashFork);
  const hashes$ = backgroundWorkerProcess$(
    { filesAndFolders, hashes },
    FolderHashWorker
  );

  return hashes$
    .pipe(bufferTime(BUFFER_TIME))
    .pipe(filter(buffer => buffer.length !== 0))
    .pipe(map(bufferedObjects => Object.assign({}, ...bufferedObjects)));
};
