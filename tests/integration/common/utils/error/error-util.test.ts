import { makeErrorHandler } from "@common/utils/error";
import { ArchifiltreDocsFileSystemErrorCode } from "@common/utils/error/error-codes";
import { handleError } from "@renderer/exporters/mets/mets";
import { createArchifiltreDocsError } from "@renderer/reducers/loading-info/loading-info-selectors";
import { notifyError } from "@renderer/utils/notifications";
import { noop } from "lodash";

jest.mock("@renderer/utils/notifications", () => ({
  notifyError: jest.fn(),
}));

const HANDLED_CODE = "handled-code";

const ERROR_MAP = {
  [HANDLED_CODE]: "handled-error",
  default: "default-error",
};

const ERROR_TITLE = "error-title";

const notifyErrorMock = notifyError as jest.Mock;

describe("error-utils", () => {
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
          [ArchifiltreDocsFileSystemErrorCode.EACCES]: errorCallback,
          default: noop,
        };

        const error = createArchifiltreDocsError({
          code: ArchifiltreDocsFileSystemErrorCode.EACCES,
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

        const error = createArchifiltreDocsError({
          code: ArchifiltreDocsFileSystemErrorCode.EACCES,
        });

        await makeErrorHandler(errorConfig)(error);

        expect(errorCallback).toHaveBeenCalledWith(error);
      });
    });
  });
});
