import { formatFileContentForResip } from "./file-format-util";
import { isWindows } from "./os-util";

jest.mock("iconv-lite", () => ({
  encode: (content, format) => Buffer.from(`encoded(${content}, ${format})`),
}));

jest.mock("./os-util", () => ({
  isWindows: jest.fn(),
}));

const isWindowsMock = isWindows as jest.Mock<any>;
const baseContent = "base-content";

describe("file-format-util", () => {
  describe("formatFileContentForResip", () => {
    it("should encode to windows-1252 format on windows", () => {
      isWindowsMock.mockReturnValue(true);

      expect(formatFileContentForResip(baseContent)).toEqual(
        Buffer.from(`encoded(${baseContent}, CP1252)`)
      );
    });

    it("should not encode format on other platforms", () => {
      isWindowsMock.mockReturnValue(false);

      expect(formatFileContentForResip(baseContent)).toEqual(
        Buffer.from(baseContent)
      );
    });
  });
});
