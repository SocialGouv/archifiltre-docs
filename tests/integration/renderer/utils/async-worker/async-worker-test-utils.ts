import type { AsyncWorker } from "@renderer/utils/async-worker";

interface AsyncWorkerMock {
  addEventListener: jest.Mock;
  postMessage: jest.Mock;
  removeEventListener: jest.Mock;
  terminate: jest.Mock;
}

export const createAsyncWorkerMock = (): AsyncWorker & AsyncWorkerMock => ({
  addEventListener: jest.fn(),
  postMessage: jest.fn(),
  removeEventListener: jest.fn(),
  terminate: jest.fn(),
});
