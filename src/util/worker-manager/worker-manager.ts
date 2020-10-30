import { ChildProcess } from "child_process";
import { without } from "lodash";
import {
  createAsyncWorkerForChildProcessController,
  ProcessControllerAsyncWorker,
  WorkerEventType,
} from "util/async-worker/async-worker-util";

export type ChildProcessConstructor = ChildProcess & { new (): ChildProcess };

class WorkerManager {
  workerControllers: ProcessControllerAsyncWorker[] = [];

  spawn(Constructor: ChildProcessConstructor): ProcessControllerAsyncWorker {
    const childProcess = new Constructor();
    const worker = createAsyncWorkerForChildProcessController(childProcess);
    this.workerControllers = [...this.workerControllers, worker];
    worker.addEventListener(WorkerEventType.EXIT, () => {
      this.workerControllers = without(this.workerControllers, worker);
    });
    return worker;
  }

  clear() {
    this.workerControllers.forEach((worker) => worker.terminate());
    this.workerControllers = [];
  }
}

export default new WorkerManager();
