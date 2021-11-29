import { parseTreeCsvExporterOptionsFromStream } from "exporters/csv/tree-csv-exporter-serializer";
import { setupChildWorkerListeners } from "util/async-worker/async-worker-util";
import { createAsyncWorkerForChildProcess } from "util/async-worker/child-process";
import { MessageTypes } from "util/batch-process/batch-process-util-types";

import { onInitialize } from "./tree-csv-exporter.impl";

const asyncWorker = createAsyncWorkerForChildProcess(async (stream) => ({
    data: await parseTreeCsvExporterOptionsFromStream(stream),
    type: MessageTypes.INITIALIZE,
}));

setupChildWorkerListeners(asyncWorker, {
    onInitialize,
});
