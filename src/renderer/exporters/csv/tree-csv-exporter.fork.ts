import { IS_WORKER } from "@common/config";

import type { WorkerMessageHandler } from "../../utils/async-worker";
import { setupChildWorkerListeners } from "../../utils/async-worker";
import { createAsyncWorkerForChildProcess } from "../../utils/async-worker/child-process";
import { MessageTypes } from "../../utils/batch-process/types";
import { onInitialize } from "./tree-csv-exporter.impl";
import { parseTreeCsvExporterOptionsFromStream } from "./tree-csv-exporter-serializer";

if (IS_WORKER) {
  const asyncWorker = createAsyncWorkerForChildProcess(async (stream) => ({
    data: await parseTreeCsvExporterOptionsFromStream(stream),
    type: MessageTypes.INITIALIZE,
  }));

  setupChildWorkerListeners(asyncWorker, {
    onInitialize: onInitialize as WorkerMessageHandler,
  });
}
