import { remote } from "electron";
import { flatten } from "lodash";
import path from "path";
import { compose } from "redux";
import { bufferTime, filter, map, tap } from "rxjs/operators";
import { createAsyncWorkerControllerClass } from "util/async-worker/async-worker-util";
import {
  aggregateResultsToMap,
  backgroundWorkerProcess$,
  BatchProcessResult,
  computeBatch$,
} from "util/batch-process/batch-process-util";
import {
  DataProcessingStream,
  operateOnDataProcessingStream,
} from "util/observable/observable-util";

import { createBufferedFileWriter } from "util/buffered-file-writer/buffered-file-writer";
import FileHashFork from "./file-hash-computer.fork";
import FolderHashFork from "./folder-hash-computer.fork";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { HashesMap } from "reducers/hashes/hashes-types";
import { Observable, OperatorFunction } from "rxjs";

const BATCH_SIZE = 500;
const BUFFER_TIME = 1000;

type ComputeHashesOptions = {
  initialValues: {
    basePath: string;
  };
};

/**
 * Returns an observable that will dispatch computed hashes every second
 * @param paths - The paths of the files
 * @param basePath - The base Path of the files.
 * @returns {Observable<{}>}
 */
export const computeHashes$ = (
  paths: string[],
  { initialValues: { basePath } }: ComputeHashesOptions
): DataProcessingStream<HashesMap> => {
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

  const hashesMapMerger = (bufferedObjects: HashesMap[]): HashesMap =>
    Object.assign({}, ...bufferedObjects);

  const bufferAndMerge = <Input, AggregatorOutput, Output extends object>(
    aggregator: (input: Input[]) => AggregatorOutput,
    merger: (input: AggregatorOutput[]) => Output
  ): OperatorFunction<Input[], Output> =>
    compose(
      map(merger),
      filter((buffer: AggregatorOutput[]) => buffer.length !== 0),
      bufferTime(BUFFER_TIME),
      map(aggregator)
    );

  const resultProcessingFunction = bufferAndMerge<
    BatchProcessResult<string>,
    HashesMap,
    HashesMap
  >(aggregateResultsToMap, hashesMapMerger);

  const resultProcessor: OperatorFunction<
    BatchProcessResult<string>[],
    HashesMap
  > =
    WRITE_DEBUG === "true"
      ? compose(
          tap<HashesMap>(resultFileWriter.write),
          resultProcessingFunction
        )
      : resultProcessingFunction;

  const errorProcessor =
    WRITE_DEBUG === "true"
      ? compose(tap(errorFileWriter.write), bufferAndMerge(flatten, flatten))
      : bufferAndMerge(flatten, flatten);

  return operateOnDataProcessingStream<BatchProcessResult<string>[], HashesMap>(
    hashes$,
    {
      error: errorProcessor,
      result: resultProcessor,
    }
  );
};

type ComputeFolderHashesOptions = {
  filesAndFolders: FilesAndFoldersMap;
  hashes: HashesMap;
};

/**
 * Returns an observable that will dispatch computed hashes every second
 * @param filesAndFolders - The filesAndFolders
 * @param hashes - The precomputed folder hashes
 * @returns {Observable<{}>}
 */
export const computeFolderHashes$ = ({
  filesAndFolders,
  hashes,
}: ComputeFolderHashesOptions): Observable<HashesMap> => {
  const FolderHashWorker = createAsyncWorkerControllerClass(FolderHashFork);
  return backgroundWorkerProcess$(
    { filesAndFolders, hashes },
    FolderHashWorker
  );
};
