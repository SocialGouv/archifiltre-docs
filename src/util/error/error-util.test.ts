import { handleError, makeErrorHandler } from "./error-util";
import { notifyError } from "util/notification/notifications-util";
import { createArchifiltreError } from "reducers/loading-info/loading-info-selectors";
import { ArchifiltreFileSystemErrorCode } from "util/error/error-codes";
import { empty } from "util/function/function-util";

jest.mock("util/notification/notifications-util", () => ({
  notifyError: jest.fn(),
}));

const HANDLED_CODE = "handled-code";

const ERROR_MAP = {
  default: "default-error",
  [HANDLED_CODE]: "handled-error",
};

const ERROR_TITLE = "error-title";

const notifyErrorMock = notifyError as jest.Mock;

describe("error-util", () => {
  describe("handleError", () => {
    it("should notify default error when error is unhandled", () => {
      notifyErrorMock.mockReset();
      handleError("unknown-code", ERROR_MAP, ERROR_TITLE);

      expect(notifyErrorMock).toHaveBeenCalledWith(
        ERROR_MAP.default,
        ERROR_TITLE
      );
    });

    it("should notify error when error is handled", () => {
      notifyErrorMock.mockReset();
      handleError(HANDLED_CODE, ERROR_MAP, ERROR_TITLE);

      expect(notifyErrorMock).toHaveBeenCalledWith(
        ERROR_MAP[HANDLED_CODE],
        ERROR_TITLE
      );
    });
  });

  describe("makeErrorHandler", () => {
    describe("with a handled error type", () => {
      it("should call the right error handler", async () => {
        const errorCallback = jest.fn();
        const errorConfig = {
          [ArchifiltreFileSystemErrorCode.EACCES]: errorCallback,
          default: empty,
        };

        const error = createArchifiltreError({
          code: ArchifiltreFileSystemErrorCode.EACCES,
        });

        await makeErrorHandler(errorConfig)(error);

        expect(errorCallback).toHaveBeenCalledWith(error);
      });
    });

    describe("with a default fallback", () => {
      it("should call the right error handler", async () => {
        const errorCallback = jest.fn();
        const errorConfig = {
          default: errorCallback,
        };

        const error = createArchifiltreError({
          code: ArchifiltreFileSystemErrorCode.EACCES,
        });

        await makeErrorHandler(errorConfig)(error);

        expect(errorCallback).toHaveBeenCalledWith(error);
      });
    });
  });
});
