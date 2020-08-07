import {
  createAsyncWorkerForChildProcess,
  fakeChildProcess,
  setupChildWorkerListeners,
} from "util/async-worker/async-worker-util";
import { loadVirtualFileSystem } from "./load-from-filesystem.impl";

const asyncWorker = createAsyncWorkerForChildProcess();

setupChildWorkerListeners(asyncWorker, { onInitialize: loadVirtualFileSystem });

export default fakeChildProcess;
