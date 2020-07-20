import {
  createAsyncWorkerForChildProcess,
  fakeChildProcess,
  setupChildWorkerListeners,
} from "util/async-worker/async-worker-util";

import { onInitialize } from "hash-computer/folder-hash-computer-impl";

const asyncWorker = createAsyncWorkerForChildProcess();

setupChildWorkerListeners(asyncWorker, {
  onInitialize,
});

export default fakeChildProcess;
