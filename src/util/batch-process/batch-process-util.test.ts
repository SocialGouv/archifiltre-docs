import {
  aggregateErrorsToMap,
  aggregateResultsToMap,
  backgroundWorkerProcess$,
  computeBatch$,
} from "./batch-process-util";
import { reportError } from "logging/reporter";
import { MessageTypes } from "util/batch-process/batch-process-util-types";
import { toArray } from "rxjs/operators";
import EventEmitter from "events";

jest.mock("os", () => ({
  cpus: () => [1, 2, 3, 4],
}));

jest.mock("../../logging/reporter", () => ({
  reportError: jest.fn(),
}));

const reportErrorMock = reportError as jest.Mock;

const NB_CPUS = 4;
const NB_WORKERS = NB_CPUS - 1;

const makeWorkerMock = () => {
  const postMessage = jest.fn();
  const addEventListener = jest.fn();
  const terminate = jest.fn();
  const WorkerBuilder = jest.fn(() => ({
    postMessage,
    addEventListener,
    terminate,
  }));

  return {
    WorkerBuilder,
    postMessage,
    addEventListener,
    terminate,
  };
};

const getEventCallback = (addEventListener, eventType) => {
  return (...args) => {
    const callbacks = addEventListener.mock.calls.filter(
      ([type]) => type === eventType
    );
    return callbacks.map(([, callback]) => callback(...args));
  };
};

describe("batch-process-util", () => {
  describe("computeBatch$", () => {
    let postMessage;
    let addEventListener;
    let WorkerBuilder;

    let responseObservable;
    let responseObserver;
    let completeObserver;
    let errorObserver;

    const testData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const batchSize = 2;
    const initialValues = { test: "test", initialValues: {} };

    beforeEach(() => {
      reportErrorMock.mockReset();
      responseObserver = jest.fn();
      completeObserver = jest.fn();
      errorObserver = jest.fn();
      ({ postMessage, addEventListener, WorkerBuilder } = makeWorkerMock());
      responseObservable = computeBatch$(testData, WorkerBuilder, {
        batchSize,
        initialValues,
      });
      responseObservable.subscribe(
        responseObserver,
        errorObserver,
        completeObserver
      );
    });
    it("should instantiate the worker", async () => {
      expect(WorkerBuilder).toHaveBeenCalledTimes(NB_WORKERS);
    });

    it("should handle initial values", () => {
      expect(postMessage).toHaveBeenCalledWith({
        type: "initialize",
        data: initialValues,
      });
    });

    it("should send fragmented computation message", () => {
      expect(postMessage).toHaveBeenCalledWith({
        type: "data",
        data: [0, 1],
      });
      expect(postMessage).toHaveBeenCalledWith({
        type: "data",
        data: [2, 3],
      });
      expect(postMessage).toHaveBeenCalledWith({
        type: "data",
        data: [4, 5],
      });
      //
      expect(postMessage).toHaveBeenCalledTimes(NB_WORKERS * 2);
    });

    it("should correctly send responses", () => {
      const messageCallback = getEventCallback(addEventListener, "message");
      const resultMessage = {
        result: [
          { param: 0, result: "R0" },
          { param: 1, result: "R1" },
        ],
        type: "result",
      };
      messageCallback({ data: resultMessage });
      expect(responseObserver).toHaveBeenCalledWith(resultMessage);
    });

    it("should correctly complete the work", () => {
      const messageCallback = getEventCallback(addEventListener, "message");
      for (
        let callIndex = 0;
        callIndex < testData.length / batchSize;
        callIndex++
      ) {
        messageCallback({
          data: {
            type: "result",
            result: [
              { param: callIndex * 2, result: `R${callIndex * 2}` },
              { param: callIndex * 2 + 1, result: `R${callIndex * 2 + 1}` },
            ],
          },
        });
      }

      expect(completeObserver).toHaveBeenCalled();
    });
  });

  describe("backgroundWorkerProcess$", () => {
    it("should proxy messages from the worker", async () => {
      const eventEmitter = new EventEmitter();

      let resolver;

      const initialized = new Promise((resolve) => (resolver = resolve));
      class Worker {
        addEventListener(type: string, callback) {
          eventEmitter.addListener(type, callback);
        }

        removeEventListener(type: string, callback) {
          eventEmitter.removeListener(type, callback);
        }

        postMessage = () => {
          resolver();
        };
        terminate = jest.fn();
      }

      const results$ = backgroundWorkerProcess$("initialData", Worker);

      await initialized;

      const testResult = "test-result";
      const result = { type: MessageTypes.RESULT, result: testResult };
      const error = { type: MessageTypes.ERROR, error: "test-error" };

      const resultPromise = results$.pipe(toArray()).toPromise();

      eventEmitter.emit("message", result);
      eventEmitter.emit("message", error);
      eventEmitter.emit("message", {
        type: MessageTypes.COMPLETE,
      });

      expect(await resultPromise).toEqual([result, error]);
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
