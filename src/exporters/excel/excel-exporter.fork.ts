import {
  createAsyncWorkerForChildProcess,
  fakeChildProcess,
  setupChildWorkerListeners,
} from "util/async-worker/async-worker-util";
import { exportToExcel } from "exporters/excel/excel-exporter.impl";

const asyncWorker = createAsyncWorkerForChildProcess();

setupChildWorkerListeners(asyncWorker, {
  onInitialize: exportToExcel,
});

export default fakeChildProcess;
