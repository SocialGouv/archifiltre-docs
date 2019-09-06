import {
  aggregateResultsToMap,
  computeBatch
} from "../util/batch-process-util";

// eslint-disable-next-line import/default
import Worker from "./hash-computer.worker.js";
import { bufferTime, map, tap } from "rxjs/operators";

const BATCH_SIZE = 500;
const BUFFER_TIME = 200;

export const computeHashes = (paths, hook, { initialValues }) => {
  const hashesObservable = computeBatch(paths, Worker, {
    batchSize: BATCH_SIZE,
    initialValues
  });
  return hashesObservable
    .pipe(map(aggregateResultsToMap))
    .pipe(bufferTime(BUFFER_TIME))
    .pipe(map(bufferedObjects => Object.assign({}, ...bufferedObjects)));
};
