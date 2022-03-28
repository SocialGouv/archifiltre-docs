import {
  IS_DIST_MODE,
  IS_PACKAGED,
  IS_WORKER,
  workerSerializedConfig,
} from "@common/config";
import type { ChildProcess, ForkOptions } from "child_process";
import { fork } from "child_process";
import { EventEmitter } from "events";
import path from "path";
import type { Readable } from "stream";

import type { WorkerMessage } from "../batch-process/types";
import { MessageTypes } from "../batch-process/types";
import type { MessageSerializer } from "../child-process-stream";
import type {
  ChildProcessAsyncWorker,
  ChildProcessControllerAsyncWorker,
} from ".";

type StreamMessageParser = (stream: Readable) => Promise<WorkerMessage>;

const WORKER_BRIDGE_PATH = path.resolve(__dirname, "_child-process.js");
const PACKAGED_WORKERS_FOLDER_RESOURCE_PATH = "workers";
const getWorkerPath = (rendererRelativeWorkerPath: string) => {
  // TODO: path validator
  if (IS_PACKAGED()) {
    const absoluteProdWorkerPath = path.resolve(
      process.resourcesPath,
      PACKAGED_WORKERS_FOLDER_RESOURCE_PATH,
      rendererRelativeWorkerPath.replace(/\.ts$/gi, ".js")
    );

    return absoluteProdWorkerPath;
  }

  if (IS_DIST_MODE) {
    const distWorkerPath = path.resolve(__dirname, rendererRelativeWorkerPath);
    return distWorkerPath.replace(/\.ts$/gi, ".js");
  }
  return path.resolve(__dirname, "../../", rendererRelativeWorkerPath);
};

/**
 * Creates an AsyncWorker bound to the current ChildProcess context
 */
export const createAsyncWorkerForChildProcess = (
  streamMessageParser?: StreamMessageParser
): ChildProcessAsyncWorker => {
  const localProcess = process as NodeJS.Process | undefined;

  const eventEmitter = new EventEmitter();

  localProcess?.addListener("message", (event) => {
    eventEmitter.emit("message", event);
  });

  void streamMessageParser?.(process.stdin).then((message) => {
    eventEmitter.emit("message", message);
  });
  return {
    addEventListener: (eventType, listener) => {
      eventEmitter.addListener(
        eventType,
        (event: Parameters<typeof listener>[0]) => {
          listener(event);
        }
      );
    },
    postMessage: (message) => {
      if (!IS_WORKER) {
        throw new Error("This must be called in a forked process");
      }
      localProcess?.send?.(message);
    },
    removeEventListener: (eventType, listener) => {
      eventEmitter.removeListener(eventType, listener);
    },
  };
};
/**
 * Creates an AsyncWorker from a ChildProcess
 * @param childProcess
 * @param sentMessageInterceptor
 */
export const createAsyncWorkerForChildProcessController = (
  childProcess: ChildProcess,
  sentMessageInterceptor?: (message: WorkerMessage) => boolean
): ChildProcessControllerAsyncWorker => ({
  addEventListener: (eventType, listener) => {
    childProcess.addListener(
      eventType,
      (data: Parameters<typeof listener>[0]) => {
        listener(data);
      }
    );
  },
  childProcess,
  postMessage: (message) => {
    if (sentMessageInterceptor && !sentMessageInterceptor(message)) {
      return;
    }
    childProcess.send(message);
  },
  removeEventListener: (eventType, listener) => {
    childProcess.removeListener(eventType, listener);
  },
  terminate: () => childProcess.kill(),
});

type DataStreamParser<TStreamParserResponse> = (
  stream: Readable
) => Promise<TStreamParserResponse>;

type MessageSerializers = {
  [key in MessageTypes]?: MessageSerializer<
    Extract<WorkerMessage, { type: key }>
  >;
};

interface CreateAsyncWorkerForChildProcessControllerFactoryOptions<
  TStreamParserResponse
> {
  dataStreamProcessor?: DataStreamParser<TStreamParserResponse>;
  messageSerializers?: MessageSerializers;
}

/**
 * This is both the index of the output stream in the childProcess.stdio array
 * and the file descriptor to access the stream from the childProcess.
 */
export const RESULT_STREAM_FILE_DESCRIPTOR = 3;

export const createAsyncWorkerForChildProcessControllerFactory =
  <TStreamParserResponse = unknown>(
    filepathFromRenderer: string,
    {
      dataStreamProcessor,
      messageSerializers = {},
    }: CreateAsyncWorkerForChildProcessControllerFactoryOptions<TStreamParserResponse> = {}
  ) =>
  (): ChildProcessControllerAsyncWorker => {
    const _workerPath = getWorkerPath(filepathFromRenderer);

    console.log(`[child-process-util] Load worker from path ${_workerPath}`);

    // 1st pipe : We make stdin pipeable to allow to stream binary data to the worker
    // 2nd pipe : We create a pipeable stream to receive data from the worker. we don't use stdout
    // as it also receives console.log
    // "ipc": To be able to share file descriptors between parent and child process,
    // we need to open an IPC channel which allows process synchronizing
    const options: ForkOptions =
      dataStreamProcessor || Object.keys(messageSerializers).length > 0
        ? {
            stdio: ["pipe", "inherit", "inherit", "pipe", "ipc"],
          }
        : {};

    console.log({ _workerPath, workerSerializedConfig });
    const worker = fork(
      _workerPath.endsWith(".js") ? _workerPath : WORKER_BRIDGE_PATH,
      [_workerPath, JSON.stringify(workerSerializedConfig)],
      options
    );

    const sentMessageInterceptor = (message: WorkerMessage) => {
      const serializer = messageSerializers[message.type] as
        | MessageSerializer<WorkerMessage>
        | undefined;
      if (serializer && worker.stdin) {
        serializer(worker.stdin, message);
        return false;
      }
      return true;
    };
    const asyncWorker = createAsyncWorkerForChildProcessController(
      worker,
      sentMessageInterceptor
    );

    if (dataStreamProcessor) {
      void dataStreamProcessor(
        worker.stdio[RESULT_STREAM_FILE_DESCRIPTOR] as Readable
      )
        .then((result) => {
          worker.emit("message", {
            result,
            type: MessageTypes.RESULT,
          });
        })
        .then(() => {
          asyncWorker.postMessage({
            type: MessageTypes.STREAM_READ,
          });
        });
    }

    return asyncWorker;
  };
