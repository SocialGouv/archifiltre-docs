import { setupChildWorkerListeners } from "util/async-worker/async-worker-util";
import { onInitialize } from "./tree-csv-exporter.impl";
import { createAsyncWorkerForChildProcess } from "util/async-worker/child-process";
import { MessageTypes } from "util/batch-process/batch-process-util-types";
import { parseTreeCsvExporterOptionsFromStream } from "exporters/csv/tree-csv-exporter-serializer";

const asyncWorker = createAsyncWorkerForChildProcess(async (stream) => ({
  type: MessageTypes.INITIALIZE,
  data: await parseTreeCsvExporterOptionsFromStream(stream),
}));

setupChildWorkerListeners(asyncWorker, {
  onInitialize,
});
