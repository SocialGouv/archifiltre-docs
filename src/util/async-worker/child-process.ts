import { ChildProcess, fork, ForkOptions } from "child_process";
import path from "path";
import {
  ChildProcessAsyncWorker,
  ChildProcessControllerAsyncWorker,
} from "util/async-worker/async-worker-util";
import { EventEmitter } from "events";
import { Readable } from "stream";
import { MessageTypes } from "util/batch-process/batch-process-util-types";

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
  postMessage: (message) => childProcess.send(message),
  terminate: () => childProcess.kill(),
  childProcess,
});

type DataStreamParser<StreamParserResponse> = (
  stream: Readable
) => Promise<StreamParserResponse>;

type CreateAsyncWorkerForChildProcessControllerFactoryOptions<
  StreamParserResponse
> = {
  dataStreamProcessor?: DataStreamParser<StreamParserResponse>;
};

export const createAsyncWorkerForChildProcessControllerFactory = <
  StreamParserResponse = any
>(
  filename: string,
  {
    dataStreamProcessor,
  }: CreateAsyncWorkerForChildProcessControllerFactoryOptions<StreamParserResponse> = {}
) => (): ChildProcessControllerAsyncWorker => {
  const workerPath = path.join(WORKER_ROOT_FOLDER, `${filename}.js`);

  const options: ForkOptions = dataStreamProcessor
    ? {
        stdio: ["inherit", "inherit", "inherit", "pipe", "ipc"],
      }
    : {};

  const worker = fork(workerPath, options);

  const asyncWorker = createAsyncWorkerForChildProcessController(worker);

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
