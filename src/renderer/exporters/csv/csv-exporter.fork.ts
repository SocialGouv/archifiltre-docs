import type { WorkerMessageHandler } from "@common/utils/async-worker/async-worker-util";
import { setupChildWorkerListeners } from "@common/utils/async-worker/async-worker-util";
import { createAsyncWorkerForChildProcess } from "@common/utils/async-worker/child-process";
import { MessageTypes } from "@common/utils/batch-process/batch-process-util-types";

import { onInitialize } from "./csv-exporter.impl";
import { parseCsvExporterOptionsFromStream } from "./csv-exporter-serializer";

const asyncWorker = createAsyncWorkerForChildProcess(async (stream) => ({
  data: await parseCsvExporterOptionsFromStream(stream),
  type: MessageTypes.INITIALIZE,
}));

setupChildWorkerListeners(asyncWorker, {
  onInitialize: onInitialize as WorkerMessageHandler,
});
