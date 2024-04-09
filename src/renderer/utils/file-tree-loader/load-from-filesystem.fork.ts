import { IS_WORKER } from "@common/config";

import { setupChildWorkerListeners, type WorkerMessageHandler } from "../async-worker";
import { createAsyncWorkerForChildProcess } from "../async-worker/child-process";
import { loadVirtualFileSystem } from "./load-from-filesystem.impl";

if (IS_WORKER) {
  const asyncWorker = createAsyncWorkerForChildProcess();

  setupChildWorkerListeners(asyncWorker, {
    onInitialize: loadVirtualFileSystem as WorkerMessageHandler,
  });
}
