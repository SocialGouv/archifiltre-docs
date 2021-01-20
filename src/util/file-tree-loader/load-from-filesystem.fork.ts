import { setupChildWorkerListeners } from "util/async-worker/async-worker-util";
import { loadVirtualFileSystem } from "./load-from-filesystem.impl";
import { createAsyncWorkerForChildProcess } from "util/async-worker/child-process";

const asyncWorker = createAsyncWorkerForChildProcess();

setupChildWorkerListeners(asyncWorker, { onInitialize: loadVirtualFileSystem });
