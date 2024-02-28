import { identifyFileFormat } from "@renderer/utils/file-format";
import path from "path";

describe("file-format-utils", () => {
  describe("identifyFileFormat", () => {
    it("should identify ucs2 files", async () => {
      const filePath = path.join(__dirname, "ucs2-file");
      const type = await identifyFileFormat(filePath);
      expect(type).toBe("ucs2");
    });

    it("should default to utf8 files", async () => {
      const filePath = path.join(__dirname, "utf8-file");
      const type = await identifyFileFormat(filePath);
      expect(type).toBe("utf8");
    });
  });
});
