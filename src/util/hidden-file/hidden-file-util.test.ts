import { isIgnored } from "util/hidden-file/hidden-file-util";

describe("hidden-file-util", () => {
  describe("isIgnored", () => {
    it("should not ignore valid files", () => {
      expect(isIgnored("path/valid-extension.txt")).toBe(false);
    });
    it("should ignore defined extensions", () => {
      expect(isIgnored("path/element.tmp")).toBe(true);
      expect(isIgnored("path/element.lnk")).toBe(true);
      expect(isIgnored("path/element.ini")).toBe(true);
    });

    it("should file explorer temporary files", () => {
      expect(isIgnored("path/.DS_Store")).toBe(true);
      expect(isIgnored("path/thumbs.db")).toBe(true);
    });

    it("should ignore software cache files", () => {
      expect(isIgnored("path/~$temp-file.doc")).toBe(true);
    });
  });
});
