import type { WorkerMessageHandler } from "../async-worker";
import { setupChildWorkerListeners } from "../async-worker";
import { createAsyncWorkerForChildProcess } from "../async-worker/child-process";
import { loadVirtualFileSystem } from "./load-from-filesystem.impl";

const asyncWorker = createAsyncWorkerForChildProcess();

setupChildWorkerListeners(asyncWorker, {
  onInitialize: loadVirtualFileSystem as WorkerMessageHandler,
});
