import { computeBatch } from "./batch-process-util";

jest.mock("os", () => ({
  cpus: () => [1, 2, 3, 4]
}));

const NB_CPUS = 4;
const NB_WORKERS = NB_CPUS - 1;

const setup = () => {
  const postMessage = jest.fn();
  const addEventListener = jest.fn();
  const WorkerBuilder = jest.fn(() => ({
    postMessage,
    addEventListener
  }));

  return {
    WorkerBuilder,
    postMessage,
    addEventListener
  };
};

const getEventCallback = (addEventListener, eventType) => {
  return addEventListener.mock.calls.find(([type]) => type === eventType)[1];
};

describe("batch-process-util", () => {
  describe("computeBatch", () => {
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
      ({ postMessage, addEventListener, WorkerBuilder } = setup());
      responseObservable = computeBatch(testData, WorkerBuilder, {
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
      const result = [{ param: 0, result: "R0" }, { param: 1, result: "R1" }];
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
});
