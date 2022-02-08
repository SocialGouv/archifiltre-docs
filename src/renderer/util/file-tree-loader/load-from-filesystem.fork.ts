import type { WorkerMessageHandler } from "../async-worker/async-worker-util";
import { setupChildWorkerListeners } from "../async-worker/async-worker-util";
import { createAsyncWorkerForChildProcess } from "../async-worker/child-process";
import { loadVirtualFileSystem } from "./load-from-filesystem.impl";

const asyncWorker = createAsyncWorkerForChildProcess();

setupChildWorkerListeners(asyncWorker, {
  onInitialize: loadVirtualFileSystem as WorkerMessageHandler,
});
