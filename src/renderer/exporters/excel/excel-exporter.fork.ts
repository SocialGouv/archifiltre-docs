import type { WorkerMessageHandler } from "@common/utils/async-worker/async-worker-util";
import { setupChildWorkerListeners } from "@common/utils/async-worker/async-worker-util";
import { createAsyncWorkerForChildProcess } from "@common/utils/async-worker/child-process";
import { MessageTypes } from "@common/utils/batch-process/batch-process-util-types";

import { parseCsvExporterOptionsFromStream } from "../csv/csv-exporter-serializer";
import { exportToExcel } from "./excel-exporter.impl";

const asyncWorker = createAsyncWorkerForChildProcess(async (stream) => ({
  data: await parseCsvExporterOptionsFromStream(stream),
  type: MessageTypes.INITIALIZE,
}));

setupChildWorkerListeners(asyncWorker, {
  onInitialize: exportToExcel as WorkerMessageHandler,
});
