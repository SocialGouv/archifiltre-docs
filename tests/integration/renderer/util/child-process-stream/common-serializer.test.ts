import {
  extractKeysFromFilesAndFolders,
  makeDataExtractor,
} from "@renderer/util/child-process-stream/common-serializer";
import { range } from "lodash";
import { pick } from "lodash/fp";

import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";

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
        excluded: "excluded",
        hello: "hello",
        world: "world",
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
