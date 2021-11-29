import { setupChildWorkerListeners } from "util/async-worker/async-worker-util";
import { createAsyncWorkerForChildProcess } from "util/async-worker/child-process";

import { loadVirtualFileSystem } from "./load-from-filesystem.impl";

const asyncWorker = createAsyncWorkerForChildProcess();

setupChildWorkerListeners(asyncWorker, { onInitialize: loadVirtualFileSystem });
