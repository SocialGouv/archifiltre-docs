import { flatten } from "lodash";
import path from "path";
import {
  aggregateResultsToMap,
  backgroundWorkerProcess$,
  computeBatch$,
} from "util/batch-process/batch-process-util";

import FileHashFork from "./file-hash-computer.fork";
import FolderHashFork from "./folder-hash-computer.fork.js";

import { bufferTime, map, filter, tap } from "rxjs/operators";
import { createAsyncWorkerControllerClass } from "util/async-worker/async-worker-util";
import { compose } from "redux";
import { operateOnDataProcessingStream } from "util/observable/observable-util";
import { createBufferedFileWriter } from "../util/buffered-file-writer/buffered-file-writer";
import { remote } from "electron";

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
    initialValues: { basePath },
  });

  const userDataPath = remote.app.getPath("userData");
  const resultFileWriter = createBufferedFileWriter(
    path.join(userDataPath, "hash-result-debug")
  );

  const errorFileWriter = createBufferedFileWriter(
    path.join(userDataPath, "hash-error-debug")
  );

  const objectMerger = (bufferedObjects) =>
    Object.assign({}, ...bufferedObjects);

  const bufferAndMerge = (aggregator, merger) =>
    compose(
      map(merger),
      filter((buffer) => buffer.length !== 0),
      bufferTime(BUFFER_TIME),
      map(aggregator)
    );

  const resultProcessor = WRITE_DEBUG
    ? compose(
        tap(resultFileWriter.write),
        bufferAndMerge(aggregateResultsToMap, objectMerger)
      )
    : bufferAndMerge(aggregateResultsToMap, objectMerger);

  const errorProcessor = WRITE_DEBUG
    ? compose(tap(errorFileWriter.write), bufferAndMerge(flatten, flatten))
    : bufferAndMerge(flatten, flatten);

  return operateOnDataProcessingStream(hashes$, {
    error: errorProcessor,
    result: resultProcessor,
  });
};

/**
 * Returns an observable that will dispatch computed hashes every second
 * @param filesAndFolders - The filesAndFolders
 * @param hashes - The precomputed folder hashes
 * @returns {Observable<{}>}
 */
export const computeFolderHashes$ = ({ filesAndFolders, hashes }) => {
  const FolderHashWorker = createAsyncWorkerControllerClass(FolderHashFork);
  return backgroundWorkerProcess$(
    { filesAndFolders, hashes },
    FolderHashWorker
  );
};
