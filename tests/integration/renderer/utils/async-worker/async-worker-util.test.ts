import { makeChildWorkerMessageCallback } from "@renderer/utils/async-worker";
import { MessageTypes } from "@renderer/utils/batch-process/types";
import { mapValues } from "lodash";

import { createAsyncWorkerMock } from "./async-worker-test-utils";

const asyncWorker = createAsyncWorkerMock();

const resetMocks = () => {
  mapValues(asyncWorker, (mock) => mock.mockReset());
};

describe("async-worker-utils", () => {
  const { error } = console;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = error;
  });
  describe("setupChildWorkerListeners", () => {
    describe("on initialize message", () => {
      describe("when the message processing succeeds", () => {
        let callback: any = null;
        const onInitialize = jest.fn();
        const message = {
          data: {
            language: "fr",
          },
          type: MessageTypes.INITIALIZE,
        };
        beforeAll(async () => {
          resetMocks();
          onInitialize.mockReset();
          callback = makeChildWorkerMessageCallback(asyncWorker, {
            onInitialize,
          });

          await callback(message);
        });

        it("should call the onInitializeCallback", () => {
          expect(onInitialize).toHaveBeenCalledWith(asyncWorker, message.data);
        });

        it("should post the ready message", () => {
          expect(asyncWorker.postMessage).toHaveBeenCalledWith({
            type: MessageTypes.READY,
          });
        });
      });

      describe("when the message processing fails", () => {
        let callback: any = null;
        const testError = new Error("test error");
        const onInitialize = () => {
          throw testError;
        };
        beforeAll(async () => {
          resetMocks();
          callback = makeChildWorkerMessageCallback(asyncWorker, {
            onInitialize,
          });
          await callback({
            data: "data",
            type: MessageTypes.INITIALIZE,
          });
        });

        it("should send the fatal error message", () => {
          expect(asyncWorker.postMessage).toHaveBeenCalledWith({
            error: "Error: test error",
            type: MessageTypes.FATAL,
          });
        });
      });
    });
    describe("on data message", () => {
      describe("with a successful processing", () => {
        let callback: any = null;
        const onData = jest.fn();
        beforeAll(async () => {
          resetMocks();
          callback = makeChildWorkerMessageCallback(asyncWorker, {
            onData,
          });
          await callback({ data: "data", type: MessageTypes.DATA });
        });

        it("should call the onData callback", () => {
          expect(onData).toHaveBeenCalledWith(asyncWorker, "data");
        });
      });

      describe("with a failed processing", () => {
        let callback: any = null;
        const testError = new Error("test error");
        const onData = () => {
          throw testError;
        };
        beforeAll(async () => {
          resetMocks();
          callback = makeChildWorkerMessageCallback(asyncWorker, {
            onData,
          });
          await callback({ data: "data", type: MessageTypes.DATA });
        });

        it("should send a fatal message", () => {
          expect(asyncWorker.postMessage).toHaveBeenCalledWith({
            error: "Error: test error",
            type: MessageTypes.FATAL,
          });
        });
      });
    });
  });
});
