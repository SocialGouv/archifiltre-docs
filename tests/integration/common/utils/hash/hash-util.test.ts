import type { HashComputingResult } from "@common/utils/hash";
import {
  hashErrorToArchifiltreDocsError,
  hashResult,
  hashResultsToMap,
} from "@common/utils/hash";
import {
  accessDenied,
  fileNotFound,
  unhandledFileError,
} from "@common/utils/hash/hash-errors";

describe("hash-util", () => {
  describe("hashErrorToArchifiltreDocsError", () => {
    it("should handle fileNotFound error", () => {
      const filePath = "path1";
      expect(hashErrorToArchifiltreDocsError(fileNotFound(filePath))).toEqual({
        code: "ENOENT",
        filePath: "path1",
        reason: "FILE_NOT_FOUND",
        type: "computingHashes",
      });
    });

    it("should handle accessDenied error", () => {
      const filePath = "path1";
      expect(hashErrorToArchifiltreDocsError(accessDenied(filePath))).toEqual({
        code: "EACCES",
        filePath: "path1",
        reason: "ACCESS_DENIED",
        type: "computingHashes",
      });
    });

    it("should handle unknown error", () => {
      const filePath = "path1";
      expect(
        hashErrorToArchifiltreDocsError(unhandledFileError(filePath, "message"))
      ).toEqual({
        code: "UNKNOWN",
        filePath: "path1",
        reason: "UNHANDLED_FILE_ERROR",
        type: "computingHashes",
      });
    });
  });

  describe("hashResultsToMap", () => {
    it("should transform hash computing result array into a hashmap", () => {
      const data: HashComputingResult[] = [
        hashResult("path1", "hash1"),
        hashResult("path2", "hash2"),
      ];

      expect(hashResultsToMap(data)).toEqual({
        path1: "hash1",
        path2: "hash2",
      });
    });
  });
});
