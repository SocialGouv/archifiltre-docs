import {
  AsyncWorkerEvent,
  createAsyncWorkerForChildProcess,
  fakeChildProcess
} from "../util/async-worker-util";
import { MessageTypes } from "../util/batch-process/batch-process-util-types";
import { onData, onInitialize } from "./file-hash-computer.impl";

const asyncWorker = createAsyncWorkerForChildProcess();

asyncWorker.addEventListener(AsyncWorkerEvent.MESSAGE, ({ data, type }) => {
  switch (type) {
    case MessageTypes.INITIALIZE:
      onInitialize(asyncWorker, data);
      break;

    case MessageTypes.DATA:
      onData(asyncWorker, data);
      break;
  }
});

export default fakeChildProcess;
