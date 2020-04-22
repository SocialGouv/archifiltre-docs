import { createAsyncWorkerMock } from "util/async-worker/async-worker-test-utils";
import { MessageTypes } from "../util/batch-process/batch-process-util-types";
import { formatPathForUserSystem } from "util/file-system/file-sys-util";
import { computeHash } from "util/hash/hash-util";
import { onData, onInitialize } from "./file-hash-computer.impl";
import { ArchifiltreErrorType } from "../reducers/loading-info/loading-info-types";
import { UnknownError } from "util/error/error-util";

jest.mock("../util/hash/hash-util", () => ({
  computeHash: jest.fn(),
}));

const basePath = "/base";
const paths = ["/path1", "/path2"];

const asyncWorker = createAsyncWorkerMock();

const computeHashMock = computeHash as jest.Mock;

describe("file-hash-computer.impl", () => {
  beforeEach(() => {
    computeHashMock.mockReset();
  });
  describe("onData", () => {
    it("should handle valid paths", () => {
      computeHashMock.mockImplementation((path: string) => `hash(${path})`);
      onInitialize(asyncWorker, { basePath });

      onData(asyncWorker, paths);

      expect(asyncWorker.postMessage).toHaveBeenCalledWith({
        result: [
          {
            param: "/path1",
            result: `hash(${formatPathForUserSystem("/base/path1")})`,
          },
          {
            param: "/path2",
            result: `hash(${formatPathForUserSystem("/base/path2")})`,
          },
        ],
        type: MessageTypes.RESULT,
      });
    });

    it("should handle errored paths", () => {
      const error = new Error("test-error");
      computeHashMock.mockImplementation((path: string) => {
        if (path === formatPathForUserSystem("/base/path2")) {
          throw error;
        }

        return `hash(${path})`;
      });
      onInitialize(asyncWorker, { basePath });

      onData(asyncWorker, paths);

      expect(asyncWorker.postMessage).toHaveBeenCalledWith({
        result: [
          {
            param: "/path1",
            result: `hash(${formatPathForUserSystem("/base/path1")})`,
          },
          { param: "/path2", result: null },
        ],
        type: MessageTypes.RESULT,
      });

      expect(asyncWorker.postMessage).toHaveBeenCalledWith({
        error: {
          code: UnknownError.UNKNOWN,
          filePath: "/path2",
          reason: "Error: test-error",
          type: ArchifiltreErrorType.COMPUTING_HASHES,
        },
        type: MessageTypes.ERROR,
      });
    });
  });
});
