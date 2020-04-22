import { reportWarning } from "logging/reporter";
import { expectToBeDefined } from "./expect-behaviour";

jest.mock("logging/reporter", () => ({
  reportWarning: jest.fn(),
}));

const reportWarningMock = reportWarning as jest.Mock;

describe("expect-behaviour", () => {
  describe("expectToBeDefined", () => {
    it("should call report message if value is undefined", () => {
      reportWarningMock.mockReset();

      const mockMessage = "mock-message";
      const isDefined = expectToBeDefined(undefined, mockMessage);

      expect(isDefined).toBe(false);
      expect(reportWarningMock).toHaveBeenCalledWith(
        JSON.stringify({
          actual: undefined,
          message: mockMessage,
          type: "expectToBeDefined",
        })
      );
    });

    it("should call report message if value is null", () => {
      reportWarningMock.mockReset();

      const mockMessage = "mock-message";
      const isDefined = expectToBeDefined(null, mockMessage);

      expect(isDefined).toBe(false);
      expect(reportWarning).toHaveBeenCalledWith(
        JSON.stringify({
          actual: null,
          message: mockMessage,
          type: "expectToBeDefined",
        })
      );
    });

    it("should not call report message if value is defined", () => {
      reportWarningMock.mockReset();

      const testedValue = "testedValue";
      const mockMessage = "mock-message";
      const isDefined = expectToBeDefined(testedValue, mockMessage);

      expect(isDefined).toBe(true);
      expect(reportWarning).not.toHaveBeenCalled();
    });
  });
});
