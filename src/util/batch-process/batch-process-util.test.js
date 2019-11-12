import { backgroundWorkerProcess$, computeBatch$ } from "./batch-process-util";
import { reportError } from "../../reporter";

jest.mock("os", () => ({
  cpus: () => [1, 2, 3, 4]
}));

jest.mock("../../reporter", () => ({
  reportError: jest.fn()
}));

const NB_CPUS = 4;
const NB_WORKERS = NB_CPUS - 1;

const makeWorkerMock = () => {
  const postMessage = jest.fn();
  const addEventListener = jest.fn();
  const terminate = jest.fn();
  const WorkerBuilder = jest.fn(() => ({
    postMessage,
    addEventListener,
    terminate
  }));

  return {
    WorkerBuilder,
    postMessage,
    addEventListener,
    terminate
  };
};

const getEventCallback = (addEventListener, eventType) => {
  return addEventListener.mock.calls.find(([type]) => type === eventType)[1];
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
    const initialValues = { test: "test" };

    beforeEach(() => {
      responseObserver = jest.fn();
      completeObserver = jest.fn();
      errorObserver = jest.fn();
      ({ postMessage, addEventListener, WorkerBuilder } = makeWorkerMock());
      responseObservable = computeBatch$(testData, WorkerBuilder, {
        batchSize,
        initialValues
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
        data: initialValues
      });
    });

    it("should send fragmented computation message", () => {
      expect(postMessage).toHaveBeenCalledWith({
        type: "data",
        data: [0, 1]
      });
      expect(postMessage).toHaveBeenCalledWith({
        type: "data",
        data: [2, 3]
      });
      expect(postMessage).toHaveBeenCalledWith({
        type: "data",
        data: [4, 5]
      });
      //
      expect(postMessage).toHaveBeenCalledTimes(NB_WORKERS * 2);
    });

    it("should correctly send responses", () => {
      const messageCallback = getEventCallback(addEventListener, "message");
      const result = [
        { param: 0, result: "R0" },
        { param: 1, result: "R1" }
      ];
      messageCallback({ data: { type: "result", result } });
      expect(responseObserver).toHaveBeenCalledWith(result);
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
              { param: callIndex * 2 + 1, result: `R${callIndex * 2 + 1}` }
            ]
          }
        });
      }

      expect(completeObserver).toHaveBeenCalled();
    });
  });

  describe("backgroundWorkerProcess$", () => {
    const initialData = "test-data";

    let WorkerBuilder;
    let addEventListener;
    let postMessage;
    let terminate;
    let result$;

    let responseObserver;
    let completeObserver;
    let errorObserver;

    beforeEach(() => {
      reportError.mockReset();
      responseObserver = jest.fn();
      completeObserver = jest.fn();
      errorObserver = jest.fn();

      ({
        terminate,
        postMessage,
        addEventListener,
        WorkerBuilder
      } = makeWorkerMock());
      result$ = backgroundWorkerProcess$(initialData, WorkerBuilder);
      result$.subscribe(responseObserver, errorObserver, completeObserver);
    });
    it("should correctly instantiate the worker", () => {
      expect(WorkerBuilder).toHaveBeenCalledTimes(1);
    });
    it("should correctly initialize the worker", () => {
      expect(postMessage).toHaveBeenCalledWith({
        type: "initialize",
        data: initialData
      });
    });
    it("should proxy results from the worker", () => {
      const testResult = "test-result";
      const messageCallback = getEventCallback(addEventListener, "message");
      messageCallback({ data: { type: "result", result: testResult } });
      expect(responseObserver).toHaveBeenCalledWith(testResult);
    });
    it("should handle errors from the worker", () => {
      const error = "test-error";
      const messageCallback = getEventCallback(addEventListener, "message");
      messageCallback({ data: { type: "error", error } });
      expect(reportError).toHaveBeenCalledWith(error);
    });
    it("should complete the observer on complete message", () => {
      const messageCallback = getEventCallback(addEventListener, "message");
      messageCallback({ data: { type: "complete" } });
      expect(completeObserver).toHaveBeenCalledTimes(1);
    });
    it("should terminate the worker on complete message", () => {
      const messageCallback = getEventCallback(addEventListener, "message");
      messageCallback({ data: { type: "complete" } });
      expect(terminate).toHaveBeenCalledTimes(1);
    });
  });
});
