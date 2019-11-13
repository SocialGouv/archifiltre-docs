import { ChildProcess } from "child_process";
import { WorkerMessage } from "./batch-process/batch-process-util-types";

export enum AsyncWorkerEvent {
  MESSAGE = "message"
}

interface AsyncWorker {
  addEventListener: (
    eventType: AsyncWorkerEvent,
    listener: EventListener
  ) => void;
  postMessage: (message: WorkerMessage) => void;
  terminate?: () => void;
}

/**
 * Creates an AsyncWorker bound to the current ChildProcess context
 */
export const createAsyncWorkerForChildProcess = (): AsyncWorker => {
  const localProcess = process as NodeJS.Process;
  return {
    addEventListener: (eventType, listener) => {
      localProcess.addListener(eventType, event => {
        listener(event);
      });
    },
    postMessage: message => {
      if (!localProcess || !localProcess.send) {
        throw new Error("This must be called in a forked process");
      }
      localProcess.send(message);
    }
  };
};

/**
 * Creates an AsyncWorker from a ChildProcess
 * @param childProcess
 */
export const createAsyncWorkerForChildProcessController = (
  childProcess: ChildProcess
): AsyncWorker => ({
  addEventListener: (eventType, listener) => {
    // Small adaptation for current BackgroundProcess and BatchProcess workers
    childProcess.addListener(eventType, data => listener({ ...data, data }));
  },
  postMessage: message => childProcess.send(message),
  terminate: () => childProcess.kill()
});

/**
 * Creates a wrapper class for the childProcess contructor to be used in batch-process-utils
 * @param ChildProcessContructor
 */
export const createAsyncWorkerControllerClass = ChildProcessContructor => {
  return class AsyncWorkerController {
    constructor() {
      const childProcess = new ChildProcessContructor();
      return createAsyncWorkerForChildProcessController(childProcess);
    }
  };
};

/**
 * Fake object used to declare a file as a ChildProcess for the typescript compiler
 * @example
 * // my-child-process.fork.ts
 * import { fakeChildProcess } from "./async-worker-util";
 * export default fakeChildProcess;
 */
// tslint:disable-next-line:no-object-literal-type-assertion
export const fakeChildProcess = {} as ChildProcess & (new () => ChildProcess);
