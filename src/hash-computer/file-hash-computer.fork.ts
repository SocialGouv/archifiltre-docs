import { setupChildWorkerListeners } from "util/async-worker/async-worker-util";
import { onData, onInitialize } from "./file-hash-computer.impl";
import { createAsyncWorkerForChildProcess } from "util/async-worker/child-process";

const asyncWorker = createAsyncWorkerForChildProcess();

setupChildWorkerListeners(asyncWorker, {
  onData,
  onInitialize,
});
