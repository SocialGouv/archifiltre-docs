import { setupChildWorkerListeners } from "util/async-worker/async-worker-util";
import { exportToExcel } from "exporters/excel/excel-exporter.impl";
import { createAsyncWorkerForChildProcess } from "util/async-worker/child-process";

const asyncWorker = createAsyncWorkerForChildProcess();

setupChildWorkerListeners(asyncWorker, {
  onInitialize: exportToExcel,
});
