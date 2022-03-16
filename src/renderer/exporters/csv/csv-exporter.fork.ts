import type { WorkerMessageHandler } from "../../utils/async-worker";
import { setupChildWorkerListeners } from "../../utils/async-worker";
import { createAsyncWorkerForChildProcess } from "../../utils/async-worker/child-process";
import { MessageTypes } from "../../utils/batch-process/types";
import { onInitialize } from "./csv-exporter.impl";
import { parseCsvExporterOptionsFromStream } from "./csv-exporter-serializer";

const asyncWorker = createAsyncWorkerForChildProcess(async (stream) => ({
  data: await parseCsvExporterOptionsFromStream(stream),
  type: MessageTypes.INITIALIZE,
}));

setupChildWorkerListeners(asyncWorker, {
  onInitialize: onInitialize as WorkerMessageHandler,
});
