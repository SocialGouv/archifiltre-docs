import { mapValues } from "lodash";

import { translations } from "../../translations/translations";
import { MessageTypes } from "../batch-process/batch-process-util-types";
import { createAsyncWorkerMock } from "./async-worker-test-utils";
import { makeChildWorkerMessageCallback } from "./async-worker-util";

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
        let callback = null;
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

          // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/await-thenable
          await callback(message);
        });
        it("should change the language", () => {
          // eslint-disable-next-line @typescript-eslint/unbound-method
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
        let callback = null;
        const testError = new Error("test error");
        const onInitialize = () => {
          throw testError;
        };
        beforeAll(async () => {
          resetMocks();
          callback = makeChildWorkerMessageCallback(asyncWorker, {
            onInitialize,
          });
          // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/await-thenable
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
        let callback = null;
        const onData = jest.fn();
        beforeAll(async () => {
          resetMocks();
          callback = makeChildWorkerMessageCallback(asyncWorker, {
            onData,
          });
          // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/await-thenable
          await callback({ data: "data", type: MessageTypes.DATA });
        });

        it("should call the onData callback", () => {
          expect(onData).toHaveBeenCalledWith(asyncWorker, "data");
        });
      });

      describe("with a failed processing", () => {
        let callback = null;
        const testError = new Error("test error");
        const onData = () => {
          throw testError;
        };
        beforeAll(async () => {
          resetMocks();
          callback = makeChildWorkerMessageCallback(asyncWorker, {
            onData,
          });
          // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/await-thenable
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
