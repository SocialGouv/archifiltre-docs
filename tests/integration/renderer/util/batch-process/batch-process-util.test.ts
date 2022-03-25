import { makeEmptyArray } from "@common/utils/array";
import type {
  AsyncWorkerControllerEvent,
  ProcessControllerAsyncWorker,
  TypedEventListener,
} from "@renderer/utils/async-worker";
import { WorkerEventType } from "@renderer/utils/async-worker";
import {
  aggregateErrorsToMap,
  aggregateResultsToMap,
  processQueueWithWorkers,
  setupWorkers$,
} from "@renderer/utils/batch-process";
import type {
  InitializeMessage,
  ReadyMessage,
  ResultMessage,
  WorkerMessage,
} from "@renderer/utils/batch-process/types";
import { MessageTypes } from "@renderer/utils/batch-process/types";
import { range, remove } from "lodash";
import { Subject } from "rxjs";
import { take, toArray } from "rxjs/operators";

jest.mock("os", () => ({
  cpus: () => [1, 2, 3, 4],
}));

jest.mock("@renderer/logging/reporter", () => ({
  reportError: jest.fn(),
}));

class TestWorker implements ProcessControllerAsyncWorker {
  listenersPool = {
    [WorkerEventType.EXIT]: [] as TypedEventListener[],
    [WorkerEventType.MESSAGE]: [] as TypedEventListener[],
    [WorkerEventType.ERROR]: [] as TypedEventListener[],
  };

  postMessage = jest.fn();

  terminate = jest.fn();

  addEventListener(type: WorkerEventType, callback: TypedEventListener) {
    this.listenersPool[type].push(callback);
  }

  removeEventListener(type: WorkerEventType, callback: TypedEventListener) {
    remove<TypedEventListener>(this.listenersPool[type], callback);
  }

  trigger(event: AsyncWorkerControllerEvent, data?: any) {
    this.listenersPool[event].forEach((callback) => {
      callback(data);
    });
  }
}

describe("batch-process-util", () => {
  describe("setupWorkers$", () => {
    it("should create a correct observable with complete message", async () => {
      const workers = makeEmptyArray(4, null).map(() => new TestWorker());
      const initialValues = "initValues";
      const { result$ } = setupWorkers$(workers, initialValues);
      const makeResult = <T>(result: T): ResultMessage<T> => ({
        result,
        type: MessageTypes.RESULT,
      });

      const makeInitialize = (data: unknown): InitializeMessage => ({
        data,
        type: MessageTypes.INITIALIZE,
      });

      const ret = new Promise<void>((done) => {
        void result$
          .pipe(toArray())
          .toPromise()
          .then((result) => {
            expect(result).toEqual(
              workers.map((worker, index) => ({
                message: makeResult(`test${index}`),
                worker,
              }))
            );
            workers.forEach((worker) => {
              expect(worker.postMessage).toHaveBeenCalledTimes(1);
              expect(worker.postMessage).toHaveBeenCalledWith(
                makeInitialize(initialValues)
              );
            });
            done();
          });
      });

      const complete = { type: MessageTypes.COMPLETE };

      workers.forEach((worker, index) => {
        worker.trigger(WorkerEventType.MESSAGE, makeResult(`test${index}`));
      });

      workers.forEach((worker) => {
        worker.trigger(WorkerEventType.MESSAGE, complete);
      });

      return ret;
    });

    it("should create a correct observable without complete message", async () => {
      const workers = makeEmptyArray(4, null).map(() => new TestWorker());
      const initialValues = "initValues";
      const { result$ } = setupWorkers$(workers, initialValues);
      const makeResult = <T>(result: T): ResultMessage<T> => ({
        result,
        type: MessageTypes.RESULT,
      });

      const makeInitialize = (data: unknown): InitializeMessage => ({
        data,
        type: MessageTypes.INITIALIZE,
      });

      const ret = new Promise<void>((done) => {
        void result$
          .pipe(take(4), toArray())
          .toPromise()
          .then((result) => {
            expect(result).toEqual(
              workers.map((worker, index) => ({
                message: makeResult(`test${index}`),
                worker,
              }))
            );
            workers.forEach((worker) => {
              expect(worker.postMessage).toHaveBeenCalledTimes(1);
              expect(worker.postMessage).toHaveBeenCalledWith(
                makeInitialize(initialValues)
              );
            });
            done();
          });
      });

      workers.forEach((worker, index) => {
        worker.trigger(WorkerEventType.MESSAGE, makeResult(`test${index}`));
      });

      return ret;
    });
  });

  describe("processQueueWithWorkers", () => {
    it("should handle queue processing", async () => {
      const makeResult = (result: string): ResultMessage => ({
        result,
        type: MessageTypes.RESULT,
      });
      const makeReady = (): ReadyMessage => ({
        type: MessageTypes.READY,
      });

      const workers = makeEmptyArray(4, null).map(() => new TestWorker());
      const workers$ = new Subject<{
        worker: ProcessControllerAsyncWorker;
        message: WorkerMessage;
      }>();
      const data = range(0, 21);

      const results$ = processQueueWithWorkers(workers$, data, 4);

      workers.forEach((worker) =>
        setTimeout(() => {
          workers$.next({
            message: makeReady(),
            worker,
          });
        })
      );

      const triggerResult = (index: number) =>
        setTimeout(() => {
          const worker = workers[index % 4];
          workers$.next({
            message: makeResult(`${index}`),
            worker,
          });
        });

      for (let i = 0; i < 6; i++) {
        triggerResult(i);
      }

      const messages = await results$.pipe(toArray()).toPromise();

      expect(messages).toEqual([
        makeResult("0"),
        makeResult("1"),
        makeResult("2"),
        makeResult("3"),
        makeResult("4"),
        makeResult("5"),
      ]);
    });
  });

  describe("aggregateResultsToMap", () => {
    it("should merge results array into a map", () => {
      const resultsArray = [
        { param: "1", result: "value1" },
        { param: "2", result: "value2" },
        { param: "3", result: "value3" },
      ];

      expect(aggregateResultsToMap(resultsArray)).toEqual({
        "1": "value1",
        "2": "value2",
        "3": "value3",
      });
    });
  });

  describe("aggregateErrorsToMap", () => {
    it("should merge results array into a map", () => {
      const errorsArray = [
        { error: "error1", param: "1" },
        { error: "error2", param: "2" },
        { error: "error3", param: "3" },
      ];

      expect(aggregateErrorsToMap(errorsArray)).toEqual({
        "1": "error1",
        "2": "error2",
        "3": "error3",
      });
    });
  });
});
