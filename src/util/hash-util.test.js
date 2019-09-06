import { computeHash } from "./hash-util";
import md5File from "md5-file";

jest.mock("md5-file", () => ({
  sync: jest.fn()
}));

describe("hash-util", () => {
  describe("computeHash", () => {
    it("should call md5-file sync with the path", () => {
      const path = "test/path/to/file";
      const responseHash = "RESPONSEHASHTEST";

      md5File.sync.mockReturnValue(responseHash);

      expect(computeHash(path)).toEqual(responseHash);
      expect(md5File.sync).toHaveBeenCalledWith(path);
    });
  });
});
