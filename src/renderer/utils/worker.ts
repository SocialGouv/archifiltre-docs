import type { ChildProcess } from "child_process";
import { without } from "lodash";

import type { ProcessControllerAsyncWorker } from "./async-worker";
import { WorkerEventType } from "./async-worker";

export type ChildProcessConstructor = ChildProcess & (new () => ChildProcess);

export type ProcessControllerAsyncWorkerFactory =
  () => ProcessControllerAsyncWorker;

class WorkerManager {
  workerControllers: ProcessControllerAsyncWorker[] = [];

  spawn(
    asyncWorkerFactory: ProcessControllerAsyncWorkerFactory
  ): ProcessControllerAsyncWorker {
    const worker = asyncWorkerFactory();
    this.workerControllers = [...this.workerControllers, worker];
    worker.addEventListener(WorkerEventType.EXIT, () => {
      this.workerControllers = without(this.workerControllers, worker);
    });
    return worker;
  }

  clear() {
    this.workerControllers.forEach((worker) => {
      worker.terminate();
    });
    this.workerControllers = [];
  }
}

export const workerManager = new WorkerManager();
