import {
  createAsyncWorkerForChildProcess,
  fakeChildProcess,
  setupChildWorkerListeners
} from "../../util/async-worker-util";
import { onInitialize } from "./csv-exporter.impl";

const asyncWorker = createAsyncWorkerForChildProcess();

setupChildWorkerListeners(asyncWorker, {
  onInitialize
});

export default fakeChildProcess;
