import { handleError } from "./error-util";
import { notifyError } from "./notifications-util";

jest.mock("./notifications-util", () => ({
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
});
