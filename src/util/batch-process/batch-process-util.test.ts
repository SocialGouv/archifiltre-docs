import {
  aggregateErrorsToMap,
  aggregateResultsToMap,
  processQueueWithWorkers,
  setupWorkers$,
} from "./batch-process-util";
import {
  InitializeMessage,
  MessageTypes,
  ReadyMessage,
  ResultMessage,
  WorkerMessage,
} from "util/batch-process/batch-process-util-types";
import { take, toArray } from "rxjs/operators";
import {
  AsyncWorkerControllerEvent,
  ProcessControllerAsyncWorker,
  WorkerEventType,
} from "util/async-worker/async-worker-util";
import { makeEmptyArray } from "util/array/array-util";
import { range, remove } from "lodash";
import { Subject } from "rxjs";

jest.mock("os", () => ({
  cpus: () => [1, 2, 3, 4],
}));

jest.mock("../../logging/reporter", () => ({
  reportError: jest.fn(),
}));

class TestWorker implements ProcessControllerAsyncWorker {
  listenersPool = {
    [WorkerEventType.EXIT]: [] as (() => void)[],
    [WorkerEventType.MESSAGE]: [] as ((data: any) => void)[],
    [WorkerEventType.ERROR]: [] as ((data: any) => void)[],
  };
  addEventListener(type, callback) {
    this.listenersPool[type].push(callback);
  }
  removeEventListener(type, callback) {
    remove(this.listenersPool[type], callback);
  }
  postMessage = jest.fn();
  trigger(event: AsyncWorkerControllerEvent, data?: any) {
    this.listenersPool[event].forEach((callback) => callback(data));
  }
  terminate = jest.fn();
}

describe("batch-process-util", () => {
  describe("setupWorkers$", () => {
    it("should create a correct observable with complete message", (done) => {
      const workers = makeEmptyArray(4, null).map(() => new TestWorker());
      const initialValues = "initValues";
      const { result$ } = setupWorkers$(workers, initialValues);
      const makeResult = <T>(result: T): ResultMessage<T> => ({
        type: MessageTypes.RESULT,
        result,
      });

      const makeInitialize = (data: any): InitializeMessage => ({
        type: MessageTypes.INITIALIZE,
        data,
      });

      result$
        .pipe(toArray())
        .toPromise()
        .then((result) => {
          expect(result).toEqual(
            workers.map((worker, index) => ({
              worker,
              message: makeResult(`test${index}`),
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

      const complete = { type: MessageTypes.COMPLETE };

      workers.forEach((worker, index) =>
        worker.trigger(WorkerEventType.MESSAGE, makeResult(`test${index}`))
      );

      workers.forEach((worker, index) =>
        worker.trigger(WorkerEventType.MESSAGE, complete)
      );
    });

    it("should create a correct observable without complete message", (done) => {
      const workers = makeEmptyArray(4, null).map(() => new TestWorker());
      const initialValues = "initValues";
      const { result$ } = setupWorkers$(workers, initialValues);
      const makeResult = <T>(result: T): ResultMessage<T> => ({
        type: MessageTypes.RESULT,
        result,
      });

      const makeInitialize = (data: any): InitializeMessage => ({
        type: MessageTypes.INITIALIZE,
        data,
      });

      result$
        .pipe(take(4), toArray())
        .toPromise()
        .then((result) => {
          expect(result).toEqual(
            workers.map((worker, index) => ({
              worker,
              message: makeResult(`test${index}`),
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

      workers.forEach((worker, index) =>
        worker.trigger(WorkerEventType.MESSAGE, makeResult(`test${index}`))
      );
    });
  });

  describe("processQueueWithWorkers", () => {
    it("should handle queue processing", async () => {
      const makeResult = (result: string): ResultMessage => ({
        type: MessageTypes.RESULT,
        result,
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
        setTimeout(() =>
          workers$.next({
            worker,
            message: makeReady(),
          })
        )
      );

      const triggerResult = (index) =>
        setTimeout(() => {
          const worker = workers[index % 4];
          workers$.next({
            worker,
            message: makeResult(`${index}`),
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
        { param: "1", error: "error1" },
        { param: "2", error: "error2" },
        { param: "3", error: "error3" },
      ];

      expect(aggregateErrorsToMap(errorsArray)).toEqual({
        "1": "error1",
        "2": "error2",
        "3": "error3",
      });
    });
  });
});
