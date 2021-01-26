import { createFilesAndFolders } from "files-and-folders-loader/files-and-folders-loader";
import {
  extractKeysFromFilesAndFolders,
  makeDataExtractor,
} from "util/child-process-stream/common-serializer";
import { pick } from "lodash/fp";
import { range } from "lodash";

describe("common-serializer", () => {
  describe("extractKeysFromFilesAndFolders", () => {
    it("should extract the keys", () => {
      const filesAndFolders = {
        id: createFilesAndFolders({ id: "id" }),
        id1: createFilesAndFolders({ id: "id1" }),
      };

      expect(extractKeysFromFilesAndFolders({ filesAndFolders })).toEqual([
        "id",
        "id1",
      ]);
    });
  });

  describe("makeDataExtractor", () => {
    it("should merge extractors", () => {
      const base = {
        hello: "hello",
        world: "world",
        excluded: "excluded",
      };

      const helloExtractor = pick("hello");
      const worldExtractor = pick("world");

      const extractor = makeDataExtractor(helloExtractor, worldExtractor);

      range(100000).forEach(() => {
        extractor(base, "");
      });

      expect(extractor(base, "")).toEqual({
        hello: "hello",
        world: "world",
      });
    });
  });
});
