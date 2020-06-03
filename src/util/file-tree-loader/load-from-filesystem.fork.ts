import {
  createAsyncWorkerForChildProcess,
  fakeChildProcess,
  setupChildWorkerListeners,
} from "util/async-worker/async-worker-util";
import { loadFolder } from "./load-from-filesystem.impl";

const asyncWorker = createAsyncWorkerForChildProcess();

setupChildWorkerListeners(asyncWorker, { onInitialize: loadFolder });

export default fakeChildProcess;
