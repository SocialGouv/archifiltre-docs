import { IS_WORKER } from "@common/config";
import sourceMapSupport from "source-map-support";

import type { WorkerMessageHandler } from "../../utils/async-worker";
import { setupChildWorkerListeners } from "../../utils/async-worker";
import { createAsyncWorkerForChildProcess } from "../../utils/async-worker/child-process";
import { onInitialize } from "./tree-csv-exporter.impl";

if (IS_WORKER) {
  sourceMapSupport.install();
  const asyncWorker = createAsyncWorkerForChildProcess();

  setupChildWorkerListeners(asyncWorker, {
    onInitialize: onInitialize as WorkerMessageHandler,
  });
}
