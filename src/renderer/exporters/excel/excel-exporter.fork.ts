import { IS_WORKER } from "@common/config";

import type { WorkerMessageHandler } from "../../utils/async-worker";
import { setupChildWorkerListeners } from "../../utils/async-worker";
import { createAsyncWorkerForChildProcess } from "../../utils/async-worker/child-process";
import { MessageTypes } from "../../utils/batch-process/types";
import { parseCsvExporterOptionsFromStream } from "../csv/csv-exporter-serializer";
import { exportToExcel } from "./excel-exporter.impl";

if (IS_WORKER) {
  const asyncWorker = createAsyncWorkerForChildProcess(async (stream) => ({
    data: await parseCsvExporterOptionsFromStream(stream),
    type: MessageTypes.INITIALIZE,
  }));

  setupChildWorkerListeners(asyncWorker, {
    onInitialize: exportToExcel as WorkerMessageHandler,
  });
}