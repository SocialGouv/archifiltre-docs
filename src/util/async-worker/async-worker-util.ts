import { ChildProcess } from "child_process";
import {
  MessageTypes,
  WorkerMessage,
} from "../batch-process/batch-process-util-types";
import translations from "translations/translations";

export enum WorkerEventType {
  MESSAGE = "message",
  EXIT = "exit",
  ERROR = "error",
}

type AsyncWorkerEventType = WorkerEventType.MESSAGE;

export type AsyncWorkerControllerEvent =
  | AsyncWorkerEventType
  | WorkerEventType.EXIT
  | WorkerEventType.ERROR;

export type AsyncWorker<EventType = AsyncWorkerEventType> = {
  addEventListener: (eventType: EventType, listener: EventListener) => void;
  removeEventListener: (eventType: EventType, listener: EventListener) => void;
  postMessage: (message: WorkerMessage) => void;
};

export type ProcessControllerAsyncWorker = AsyncWorker<AsyncWorkerControllerEvent> & {
  terminate: () => void;
};

type ChildProcessAsyncWorker = AsyncWorker;

/**
 * Creates an AsyncWorker bound to the current ChildProcess context
 */
export const createAsyncWorkerForChildProcess = (): ChildProcessAsyncWorker => {
  const localProcess = process as NodeJS.Process;
  return {
    addEventListener: (eventType, listener) => {
      localProcess.addListener(eventType, (event) => {
        listener(event);
      });
    },
    removeEventListener: (eventType, listener) => {
      localProcess.removeListener("loaded", listener);
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
): ProcessControllerAsyncWorker => ({
  addEventListener: (eventType, listener) => {
    childProcess.addListener(eventType, (data) => {
      listener(data);
    });
  },
  removeEventListener: (eventType, listener) => {
    childProcess.removeListener(eventType, listener);
  },
  postMessage: (message) => childProcess.send(message),
  terminate: () => childProcess.kill(),
});

/**
 * Creates a wrapper class for the childProcess contructor to be used in batch-process-common
 * @param ChildProcessConstructor
 */
export const createAsyncWorkerControllerClass = (ChildProcessConstructor) => {
  return class AsyncWorkerController {
    constructor() {
      const childProcess = new ChildProcessConstructor();
      return createAsyncWorkerForChildProcessController(childProcess);
    }
  };
};

export type WorkerMessageHandler = (
  asyncWorker: AsyncWorker,
  data: any
) => void | Promise<void>;

interface SetupChildWorkerListenersOptions {
  onInitialize?: WorkerMessageHandler;
  onData?: WorkerMessageHandler;
}

export const makeChildWorkerMessageCallback = (
  asyncWorker: AsyncWorker,
  { onInitialize, onData }: SetupChildWorkerListenersOptions
) => async ({ data, type }: any) => {
  switch (type) {
    case MessageTypes.INITIALIZE:
      if (data.language) {
        await translations.changeLanguage(data.language);
      }
      if (!onInitialize) {
        break;
      }
      try {
        await onInitialize(asyncWorker, data);
        asyncWorker.postMessage({ type: MessageTypes.READY });
      } catch (err) {
        asyncWorker.postMessage({
          type: MessageTypes.FATAL,
          error: err.toString(),
        });
      }
      break;

    case MessageTypes.DATA:
      if (!onData) {
        break;
      }
      try {
        await onData(asyncWorker, data);
      } catch (err) {
        asyncWorker.postMessage({
          type: MessageTypes.FATAL,
          error: err.toString(),
        });
      }
      break;
  }
};

/**
 * Setup the listeners on an async worker. Each callback will be called when each message type is received.
 * @param asyncWorker - The async worker
 * @param listeners
 * @param listeners.onInitialize - The callback for MessageTypes.INITIALIZE messages
 * @param listeners.onData - The callback for MessageTypes.DATA messages
 */
export const setupChildWorkerListeners = (
  asyncWorker: AsyncWorker,
  listeners: SetupChildWorkerListenersOptions
) => {
  asyncWorker.addEventListener(
    WorkerEventType.MESSAGE,
    makeChildWorkerMessageCallback(asyncWorker, listeners)
  );
};

/**
 * Fake object used to declare a file as a ChildProcess for the typescript compiler
 * @example
 * // my-child-process.fork.ts
 * import { fakeChildProcess } from "./async-worker-util";
 * export default fakeChildProcess;
 */
export const fakeChildProcess = {} as ChildProcess & (new () => ChildProcess);
