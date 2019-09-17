import {
  aggregateResultsToMap,
  backgroundWorkerProcess$,
  computeBatch$
} from "../util/batch-process-util";

// eslint-disable-next-line import/default
import FileHashWorker from "./file-hash-computer.worker.js";

// eslint-disable-next-line import/default
import FolderHashWorker from "./folder-hash-computer.worker.js";

import { bufferTime, map, tap, filter } from "rxjs/operators";

const BATCH_SIZE = 500;
const BUFFER_TIME = 200;

/**
 * Returns an observable that will dispatch computed hashes every 200ms
 * @param paths - The paths of the files
 * @param basePath - The base Path of the files.
 * @returns {Observable<{}>}
 */
export const computeHashes$ = (paths, { initialValues: { basePath } }) => {
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

export const computeFolderHashes$ = files_and_folders => {
  const hashes$ = backgroundWorkerProcess$(files_and_folders, FolderHashWorker);

  return hashes$
    .pipe(bufferTime(BUFFER_TIME))
    .pipe(filter(buffer => buffer.length !== 0))
    .pipe(map(bufferedObjects => Object.assign({}, ...bufferedObjects)))
    .pipe(tap(hashes => console.log("hashes pushed", hashes)));
};
