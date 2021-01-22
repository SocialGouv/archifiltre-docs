import { setupChildWorkerListeners } from "util/async-worker/async-worker-util";
import { onInitialize } from "./csv-exporter.impl";
import { createAsyncWorkerForChildProcess } from "util/async-worker/child-process";
import { MessageTypes } from "util/batch-process/batch-process-util-types";
import { parseCsvExporterOptionsFromStream } from "exporters/csv/csv-exporter-serializer";

const asyncWorker = createAsyncWorkerForChildProcess(async (stream) => ({
  type: MessageTypes.INITIALIZE,
  data: await parseCsvExporterOptionsFromStream(stream),
}));

setupChildWorkerListeners(asyncWorker, {
  onInitialize,
});
