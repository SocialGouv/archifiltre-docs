import { setupChildWorkerListeners } from "util/async-worker/async-worker-util";

import { onInitialize } from "hash-computer/folder-hash-computer-impl";
import { createAsyncWorkerForChildProcess } from "util/async-worker/child-process";

const asyncWorker = createAsyncWorkerForChildProcess();

setupChildWorkerListeners(asyncWorker, {
  onInitialize,
});
