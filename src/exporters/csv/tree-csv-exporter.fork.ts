import { setupChildWorkerListeners } from "util/async-worker/async-worker-util";
import { onInitialize } from "./tree-csv-exporter.impl";
import { createAsyncWorkerForChildProcess } from "util/async-worker/child-process";

const asyncWorker = createAsyncWorkerForChildProcess();

setupChildWorkerListeners(asyncWorker, {
  onInitialize,
});
