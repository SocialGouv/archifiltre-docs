import { mapValues } from "lodash";
import translations from "translations/translations";
import { createAsyncWorkerMock } from "util/async-worker/async-worker-test-utils";
import { makeChildWorkerMessageCallback } from "util/async-worker/async-worker-util";
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
                it("should change the language", () => {
                    expect(translations.changeLanguage).toHaveBeenCalledWith(
                        "fr"
                    );
                });

                it("should call the onInitializeCallback", () => {
                    expect(onInitialize).toHaveBeenCalledWith(
                        asyncWorker,
                        message.data
                    );
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
                const onInitialize = () => {
                    throw error;
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
                let callback;
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
                let callback;
                const error = new Error("test error");
                const onData = () => {
                    throw error;
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
