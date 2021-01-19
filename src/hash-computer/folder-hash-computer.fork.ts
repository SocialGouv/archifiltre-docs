import { setupChildWorkerListeners } from "util/async-worker/async-worker-util";

import { onInitialize } from "hash-computer/folder-hash-computer-impl";
import { createAsyncWorkerForChildProcess } from "util/async-worker/child-process";
import { parseFolderHashComputerInputFromStream } from "util/vfs-stream/vfs-stream";
import {
  InitializeMessage,
  MessageTypes,
} from "util/batch-process/batch-process-util-types";

const streamMessageParser = (stream): Promise<InitializeMessage> =>
  parseFolderHashComputerInputFromStream(stream).then((data) => ({
    type: MessageTypes.INITIALIZE,
    data,
  }));

const asyncWorker = createAsyncWorkerForChildProcess(streamMessageParser);

setupChildWorkerListeners(asyncWorker, {
  onInitialize,
});
