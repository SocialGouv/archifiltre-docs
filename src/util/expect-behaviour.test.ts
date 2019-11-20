import { reportMessage } from "../logging/reporter";
import { expectToBeDefined } from "./expect-behaviour";

jest.mock("../logging/reporter", () => ({
  reportMessage: jest.fn()
}));

const reportMessageMock = reportMessage as jest.Mock;

describe("expect-behaviour", () => {
  describe("expectToBeDefined", () => {
    it("should call report message if value is undefined", () => {
      reportMessageMock.mockReset();

      const mockMessage = "mock-message";
      const isDefined = expectToBeDefined(undefined, mockMessage);

      expect(isDefined).toBe(false);
      expect(reportMessageMock).toHaveBeenCalledWith(
        JSON.stringify({
          actual: undefined,
          message: mockMessage,
          type: "expectToBeDefined"
        })
      );
    });

    it("should call report message if value is null", () => {
      reportMessageMock.mockReset();

      const mockMessage = "mock-message";
      const isDefined = expectToBeDefined(null, mockMessage);

      expect(isDefined).toBe(false);
      expect(reportMessage).toHaveBeenCalledWith(
        JSON.stringify({
          actual: null,
          message: mockMessage,
          type: "expectToBeDefined"
        })
      );
    });

    it("should not call report message if value is defined", () => {
      reportMessageMock.mockReset();

      const testedValue = "testedValue";
      const mockMessage = "mock-message";
      const isDefined = expectToBeDefined(testedValue, mockMessage);

      expect(isDefined).toBe(true);
      expect(reportMessage).not.toHaveBeenCalled();
    });
  });
});
