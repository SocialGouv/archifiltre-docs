import os from "os";
import { isWindows } from "./os-util";

jest.mock("os", () => ({
  type: jest.fn()
}));

describe("os-util", () => {
  describe("isWindows", () => {
    const typeMock = os.type as jest.Mock;

    it("should return true when os is windows", () => {
      typeMock.mockReturnValue("Windows_NT");
      expect(isWindows()).toBe(true);
    });

    it("should return false when os is linux", () => {
      typeMock.mockReturnValue("Linux");
      expect(isWindows()).toBe(false);
    });

    it("should return false when os is OSX", () => {
      typeMock.mockReturnValue("Darwin");
      expect(isWindows()).toBe(false);
    });
  });
});
