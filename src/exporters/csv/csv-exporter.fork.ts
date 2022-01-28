import type { WorkerMessageHandler } from "../../util/async-worker/async-worker-util";
import { setupChildWorkerListeners } from "../../util/async-worker/async-worker-util";
import { createAsyncWorkerForChildProcess } from "../../util/async-worker/child-process";
import { MessageTypes } from "../../util/batch-process/batch-process-util-types";
import { onInitialize } from "./csv-exporter.impl";
import { parseCsvExporterOptionsFromStream } from "./csv-exporter-serializer";

const asyncWorker = createAsyncWorkerForChildProcess(async (stream) => ({
  data: await parseCsvExporterOptionsFromStream(stream),
  type: MessageTypes.INITIALIZE,
}));

setupChildWorkerListeners(asyncWorker, {
  onInitialize: onInitialize as WorkerMessageHandler,
});
