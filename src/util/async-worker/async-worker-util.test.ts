import translations from "translations/translations";
import { makeChildWorkerMessageCallback } from "util/async-worker/async-worker-util";
import { createAsyncWorkerMock } from "util/async-worker/async-worker-test-utils";
import { mapValues } from "lodash";
import { MessageTypes } from "util/batch-process/batch-process-util-types";

jest.mock("translations/translations", () => ({
  changeLanguage: jest.fn(),
}));

const asyncWorker = createAsyncWorkerMock();

const resetMocks = () => {
  (translations.changeLanguage as jest.Mock).mockReset();
  mapValues(asyncWorker, (mock) => mock.mockReset());
};

describe("async-worker-util", () => {
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
        let callback;
        const onInitialize = jest.fn();
        const message = {
          type: MessageTypes.INITIALIZE,
          data: {
            language: "fr",
          },
        };
        beforeAll(async () => {
          resetMocks();
          onInitialize.mockReset();
          callback = makeChildWorkerMessageCallback(asyncWorker, {
            onInitialize,
          });

          await callback(message);
        });
        it("should change the language", () => {
          expect(translations.changeLanguage).toHaveBeenCalledWith("fr");
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
        let callback;
        const error = new Error("test error");
        let onInitialize = () => {
          throw error;
        };
        beforeAll(async () => {
          resetMocks();
          callback = makeChildWorkerMessageCallback(asyncWorker, {
            onInitialize,
          });
          await callback({ type: MessageTypes.INITIALIZE, data: "data" });
        });

        it("should send the fatal error message", () => {
          expect(asyncWorker.postMessage).toHaveBeenCalledWith({
            type: MessageTypes.FATAL,
            error: "Error: test error",
          });
        });
      });
    });
    describe("on data message", () => {
      describe("with a successful processing", () => {
        let callback;
        let onData = jest.fn();
        beforeAll(async () => {
          resetMocks();
          callback = makeChildWorkerMessageCallback(asyncWorker, {
            onData,
          });
          await callback({ type: MessageTypes.DATA, data: "data" });
        });

        it("should call the onData callback", () => {
          expect(onData).toHaveBeenCalledWith(asyncWorker, "data");
        });
      });

      describe("with a failed processing", () => {
        let callback;
        const error = new Error("test error");
        let onData = () => {
          throw error;
        };
        beforeAll(async () => {
          resetMocks();
          callback = makeChildWorkerMessageCallback(asyncWorker, {
            onData,
          });
          await callback({ type: MessageTypes.DATA, data: "data" });
        });

        it("should send a fatal message", () => {
          expect(asyncWorker.postMessage).toHaveBeenCalledWith({
            type: MessageTypes.FATAL,
            error: "Error: test error",
          });
        });
      });
    });
  });
});
