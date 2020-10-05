import { AsyncWorker } from "./async-worker-util";

interface AsyncWorkerMock {
  addEventListener: jest.Mock;
  postMessage: jest.Mock;
  removeEventListener: jest.Mock;
  terminate: jest.Mock;
}

export const createAsyncWorkerMock = (): AsyncWorker & AsyncWorkerMock => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  postMessage: jest.fn(),
  terminate: jest.fn(),
});
