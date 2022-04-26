import { IS_WORKER } from "@common/config";
import sourceMapSupport from "source-map-support";

import type { WorkerMessageHandler } from "../../utils/async-worker";
import { setupChildWorkerListeners } from "../../utils/async-worker";
import { createAsyncWorkerForChildProcess } from "../../utils/async-worker/child-process";
import { MessageTypes } from "../../utils/batch-process/types";
import { onInitialize } from "./csv-exporter.impl";
import { parseCsvExporterOptionsFromStream } from "./csv-exporter-serializer";

if (IS_WORKER) {
  sourceMapSupport.install();
  const asyncWorker = createAsyncWorkerForChildProcess(async (stream) => ({
    data: await parseCsvExporterOptionsFromStream(stream),
    type: MessageTypes.INITIALIZE,
  }));

  setupChildWorkerListeners(asyncWorker, {
    onInitialize: onInitialize as WorkerMessageHandler,
  });
}
