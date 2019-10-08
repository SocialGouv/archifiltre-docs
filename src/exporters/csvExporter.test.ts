import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { computeDerived, ff } from "../datastore/files-and-folders";
import { DispatchExts } from "../reducers/archifiltre-types";
import { StoreState } from "../reducers/store";
import { generateCsvExportArray } from "./csvExporter";

const mockStore = configureMockStore<StoreState, DispatchExts>([thunk]);

describe("csvExporter", () => {
  describe("generateCsvExportArray", () => {
    it("should generate valid csv data", () => {
      const tagName = "test-tag-1";
      const taggedFfId = "/folder/ff-id";
      const untaggedFfId = "/folder/ff-id-2";
      const tagId = "test-tag-id";
      const lastModified = 1570542691716;
      const tags = {
        [tagId]: {
          ffIds: [taggedFfId],
          id: tagId,
          name: tagName
        }
      };

      const origins = [
        [{ size: 10, lastModified }, taggedFfId],
        [{ size: 20, lastModified }, untaggedFfId]
      ];

      const store = mockStore({
        tags: {
          current: { tags },
          future: [],
          past: [],
          present: { tags }
        }
      });

      const filesAndFolders = computeDerived(ff(origins));

      const csvArray = store.dispatch(generateCsvExportArray(filesAndFolders));
      expect(csvArray).toEqual([
        [
          "",
          "path",
          "path length",
          "name",
          "extension",
          "size (octet)",
          "last_modified",
          "alias",
          "comments",
          "file/folder",
          "depth",
          "tag0 : test-tag-1"
        ],
        [
          "",
          "/folder",
          7,
          "folder",
          "",
          30,
          "08/10/2019",
          "",
          "",
          "folder",
          1,
          ""
        ],
        [
          "",
          "/folder/ff-id",
          13,
          "ff-id",
          "",
          10,
          "08/10/2019",
          "",
          "",
          "file",
          2,
          "test-tag-1"
        ],
        [
          "",
          "/folder/ff-id-2",
          15,
          "ff-id-2",
          "",
          20,
          "08/10/2019",
          "",
          "",
          "file",
          2,
          ""
        ]
      ]);
    });
  });
});
