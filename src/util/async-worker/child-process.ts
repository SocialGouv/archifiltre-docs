import { ChildProcess, fork } from "child_process";
import path from "path";
import {
  ChildProcessAsyncWorker,
  ChildProcessControllerAsyncWorker,
} from "util/async-worker/async-worker-util";
import { EventEmitter } from "events";

/**
 * Creates an AsyncWorker bound to the current ChildProcess context
 */
export const createAsyncWorkerForChildProcess = (): ChildProcessAsyncWorker => {
  const localProcess = process as NodeJS.Process;

  const eventEmitter = new EventEmitter();

  localProcess.addListener("message", (event) => {
    eventEmitter.emit("message", event);
  });

  return {
    addEventListener: (eventType, listener) => {
      eventEmitter.addListener(eventType, (event) => {
        listener(event);
      });
    },
    removeEventListener: (eventType, listener) => {
      eventEmitter.removeListener(eventType, listener);
    },
    postMessage: (message) => {
      if (!localProcess || !localProcess.send) {
        throw new Error("This must be called in a forked process");
      }
      localProcess.send(message);
    },
  };
};
/**
 * Creates an AsyncWorker from a ChildProcess
 * @param childProcess
 */
export const createAsyncWorkerForChildProcessController = (
  childProcess: ChildProcess
): ChildProcessControllerAsyncWorker => ({
  addEventListener: (eventType, listener) => {
    childProcess.addListener(eventType, (data) => {
      listener(data);
    });
  },
  removeEventListener: (eventType, listener) => {
    childProcess.removeListener(eventType, listener);
  },
  postMessage: (message) => {
    childProcess.send(message);
  },
  terminate: () => childProcess.kill(),
  childProcess,
});

export const createAsyncWorkerForChildProcessControllerFactory = <
  StreamParserResponse = any
>(
  filename: string
) => (): ChildProcessControllerAsyncWorker => {
  const workerPath = path.join(WORKER_ROOT_FOLDER, `${filename}.js`);

  const worker = fork(workerPath);

  const asyncWorker = createAsyncWorkerForChildProcessController(worker);

  return asyncWorker;
};
