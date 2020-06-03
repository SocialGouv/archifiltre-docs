import {
  createAsyncWorkerForChildProcess,
  fakeChildProcess,
  setupChildWorkerListeners,
} from "util/async-worker/async-worker-util";
import { onInitialize } from "./load-from-json.impl";

const asyncWorker = createAsyncWorkerForChildProcess();

setupChildWorkerListeners(asyncWorker, { onInitialize });

export default fakeChildProcess;
