import { identifyFileFormat } from "./file-format-util";
import path from "path";

describe("file-format-util", () => {
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
