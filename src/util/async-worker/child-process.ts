import { ChildProcess, fork, ForkOptions } from "child_process";
import path from "path";
import {
  ChildProcessAsyncWorker,
  ChildProcessControllerAsyncWorker,
} from "util/async-worker/async-worker-util";
import { Readable } from "stream";
import {
  MessageTypes,
  WorkerMessage,
} from "util/batch-process/batch-process-util-types";
import { MessageSerializer } from "util/vfs-stream/vfs-stream";
import { EventEmitter } from "events";

type StreamMessageParser = (stream) => Promise<WorkerMessage>;

/**
 * Creates an AsyncWorker bound to the current ChildProcess context
 */
export const createAsyncWorkerForChildProcess = (
  streamMessageParser?: StreamMessageParser
): ChildProcessAsyncWorker => {
  const localProcess = process as NodeJS.Process;

  const eventEmitter = new EventEmitter();

  localProcess.addListener("message", (event) => {
    eventEmitter.emit("message", event);
  });

  if (streamMessageParser) {
    streamMessageParser(process.stdin).then((message) => {
      eventEmitter.emit("message", message);
    });
  }
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
 * @param sentMessageInterceptor
 */
export const createAsyncWorkerForChildProcessController = (
  childProcess: ChildProcess,
  sentMessageInterceptor?: (message: WorkerMessage) => boolean
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
    if (sentMessageInterceptor && !sentMessageInterceptor(message)) {
      return;
    }
    childProcess.send(message);
  },
  terminate: () => childProcess.kill(),
  childProcess,
});

type DataStreamParser<StreamParserResponse> = (
  stream: Readable
) => Promise<StreamParserResponse>;

type MessageSerializers = {
  [key in MessageTypes]?: MessageSerializer<WorkerMessage>;
};

type CreateAsyncWorkerForChildProcessControllerFactoryOptions<
  StreamParserResponse
> = {
  dataStreamProcessor?: DataStreamParser<StreamParserResponse>;
  messageSerializers?: MessageSerializers;
};

export const createAsyncWorkerForChildProcessControllerFactory = <
  StreamParserResponse = any
>(
  filename: string,
  {
    dataStreamProcessor,
    messageSerializers = {},
  }: CreateAsyncWorkerForChildProcessControllerFactoryOptions<StreamParserResponse> = {}
) => (): ChildProcessControllerAsyncWorker => {
  const workerPath = path.join(WORKER_ROOT_FOLDER, `${filename}.js`);

  const options: ForkOptions =
    dataStreamProcessor || Object.keys(messageSerializers).length > 0
      ? {
          stdio: ["pipe", "inherit", "inherit", "pipe", "ipc"],
        }
      : {};

  const worker = fork(workerPath, options);

  const sentMessageInterceptor = (message: WorkerMessage) => {
    const serializer = messageSerializers[message.type];
    if (serializer && worker.stdio[0]) {
      serializer(worker.stdio[0], message);
      return false;
    }
    return true;
  };
  const asyncWorker = createAsyncWorkerForChildProcessController(
    worker,
    sentMessageInterceptor
  );

  if (dataStreamProcessor) {
    dataStreamProcessor(worker.stdio[3] as Readable)
      .then((result) => {
        worker.emit("message", {
          type: MessageTypes.RESULT,
          result,
        });
      })
      .then(() =>
        asyncWorker.postMessage({
          type: MessageTypes.STREAM_READ,
        })
      );
  }

  return asyncWorker;
};
