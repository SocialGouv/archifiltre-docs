import type { ChildProcess } from "child_process";

import { translations } from "../../translations/translations";
import type { WorkerMessage } from "../batch-process/types";
import { MessageTypes } from "../batch-process/types";
import type { WithLanguage } from "../language/types";

/* eslint-disable @typescript-eslint/naming-convention */
export enum WorkerEventType {
  MESSAGE = "message",
  EXIT = "exit",
  ERROR = "error",
}
/* eslint-enable @typescript-eslint/naming-convention */

type AsyncWorkerEventType = WorkerEventType.MESSAGE;

export type AsyncWorkerControllerEvent =
  | AsyncWorkerEventType
  | WorkerEventType.ERROR
  | WorkerEventType.EXIT;

type AsyncWorkerEvent = Omit<Event, "type"> & WorkerMessage;
export type TypedEventListener = (evt: AsyncWorkerEvent) => void;

export interface AsyncWorker<TEventType = AsyncWorkerEventType> {
  addEventListener: (
    eventType: TEventType,
    listener: TypedEventListener
  ) => void;
  removeEventListener: (
    eventType: TEventType,
    listener: TypedEventListener
  ) => void;
  postMessage: (message: WorkerMessage) => void;
}

export type ProcessControllerAsyncWorker =
  AsyncWorker<AsyncWorkerControllerEvent> & {
    terminate: () => void;
  };

export type ChildProcessControllerAsyncWorker = ProcessControllerAsyncWorker & {
  childProcess: ChildProcess;
};

export type ChildProcessAsyncWorker = AsyncWorker;

export type WorkerMessageHandler = (
  asyncWorker: AsyncWorker,
  data: unknown
) => Promise<void> | void;

interface SetupChildWorkerListenersOptions {
  onInitialize?: WorkerMessageHandler;
  onData?: WorkerMessageHandler;
}

export const makeChildWorkerMessageCallback =
  (
    asyncWorker: AsyncWorker,
    { onInitialize, onData }: SetupChildWorkerListenersOptions
  ): TypedEventListener =>
  async (event) => {
    switch (event.type) {
      case MessageTypes.INITIALIZE:
        // eslint-disable-next-line no-case-declarations
        const data = event.data as Partial<WithLanguage<unknown>>;
        if (data.language) {
          await translations.changeLanguage(data.language);
        }
        if (!onInitialize) {
          break;
        }
        try {
          await onInitialize(asyncWorker, event.data);
          asyncWorker.postMessage({ type: MessageTypes.READY });
        } catch (err: unknown) {
          console.error(err);
          asyncWorker.postMessage({
            error: String(err),
            type: MessageTypes.FATAL,
          });
        }
        break;

      case MessageTypes.DATA:
        if (!onData) {
          break;
        }
        try {
          await onData(asyncWorker, event.data);
        } catch (err: unknown) {
          console.error(err);
          asyncWorker.postMessage({
            error: String(err),
            type: MessageTypes.FATAL,
          });
        }
        break;
      default:
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
): void => {
  asyncWorker.addEventListener(
    WorkerEventType.MESSAGE,
    makeChildWorkerMessageCallback(asyncWorker, listeners)
  );
};
