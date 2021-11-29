import type { ChildProcess } from "child_process";
import translations from "translations/translations";

import type { WorkerMessage } from "../batch-process/batch-process-util-types";
import { MessageTypes } from "../batch-process/batch-process-util-types";

export enum WorkerEventType {
    MESSAGE = "message",
    EXIT = "exit",
    ERROR = "error",
}

type AsyncWorkerEventType = WorkerEventType.MESSAGE;

export type AsyncWorkerControllerEvent =
    | AsyncWorkerEventType
    | WorkerEventType.ERROR
    | WorkerEventType.EXIT;

export interface AsyncWorker<EventType = AsyncWorkerEventType> {
    addEventListener: (eventType: EventType, listener: EventListener) => void;
    removeEventListener: (
        eventType: EventType,
        listener: EventListener
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
    data: any
) => Promise<void> | void;

interface SetupChildWorkerListenersOptions {
    onInitialize?: WorkerMessageHandler;
    onData?: WorkerMessageHandler;
}

export const makeChildWorkerMessageCallback =
    (
        asyncWorker: AsyncWorker,
        { onInitialize, onData }: SetupChildWorkerListenersOptions
    ) =>
    async ({ data, type }: any) => {
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
                    console.error(err);
                    asyncWorker.postMessage({
                        error: err.toString(),
                        type: MessageTypes.FATAL,
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
                    console.error(err);
                    asyncWorker.postMessage({
                        error: err.toString(),
                        type: MessageTypes.FATAL,
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
