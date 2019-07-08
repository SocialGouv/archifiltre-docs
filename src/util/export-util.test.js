import * as FF from "datastore/files-and-folders";
import { fileAndFoldersToCsv } from "./export-util";
const path = require("path");

jest.mock("./file-sys-util", () => ({
  hashFile: filePath => `hash(${filePath})`
}));

const LAST_MODIFIED_1 = 1515631977601.4116;
const LAST_MODIFIED_2 = 1515631753478.3247;

const testData = {
  "": {
    name: "",
    alias: "",
    comments: "",
    children: ["/test"],
    file_size: 0,
    file_last_modified: 0,
    size: 303244,
    last_modified_max: 1515631987559.96,
    last_modified_list: [1515631987559.96],
    last_modified_min: 1493052040437.3745,
    last_modified_median: 1515631953059.1887,
    last_modified_average: 1513330730588.3906,
    depth: 0,
    nb_files: 49,
    sort_by_size_index: [0],
    sort_by_date_index: [0]
  },
  "/test": {
    name: "test",
    alias: "",
    comments: "",
    children: ["/test/file1", "/test/file2"],
    file_size: 0,
    file_last_modified: LAST_MODIFIED_1,
    size: 1603,
    last_modified_max: LAST_MODIFIED_2,
    last_modified_list: [LAST_MODIFIED_1, LAST_MODIFIED_2],
    last_modified_min: LAST_MODIFIED_1,
    last_modified_median: LAST_MODIFIED_1,
    last_modified_average: LAST_MODIFIED_1,
    depth: 1,
    nb_files: 2,
    sort_by_size_index: [],
    sort_by_date_index: []
  },
  "/test/file1": {
    name: "file1",
    alias: "",
    comments: "",
    children: [],
    file_size: 240,
    file_last_modified: LAST_MODIFIED_1,
    size: 240,
    last_modified_max: LAST_MODIFIED_1,
    last_modified_list: [LAST_MODIFIED_1],
    last_modified_min: LAST_MODIFIED_1,
    last_modified_median: LAST_MODIFIED_1,
    last_modified_average: LAST_MODIFIED_1,
    depth: 2,
    nb_files: 1,
    sort_by_size_index: [],
    sort_by_date_index: []
  },
  "/test/file2": {
    name: "file2",
    alias: "",
    comments: "",
    children: [],
    file_size: 1403,
    file_last_modified: LAST_MODIFIED_2,
    size: 1403,
    last_modified_max: LAST_MODIFIED_2,
    last_modified_list: [LAST_MODIFIED_2],
    last_modified_min: LAST_MODIFIED_2,
    last_modified_median: LAST_MODIFIED_2,
    last_modified_average: LAST_MODIFIED_2,
    depth: 2,
    nb_files: 1,
    sort_by_size_index: [],
    sort_by_date_index: []
  }
};

const HEADER = [
  "path",
  "name",
  "size (octet)",
  "last_modified",
  "alias",
  "comments",
  "tags",
  "hash",
  "is_file"
];

describe("export-util", () => {
  describe("with files", () => {
    it("should produce the right CSV", async () => {
      const testFF = FF.fromJs(testData);

      const csv = await fileAndFoldersToCsv(
        testFF,
        [],
        "/base/path/to/folder/test"
      );

      const fullPath1 = path.join("/base/path/to/folder/test", "file1");
      const fullPath2 = path.join("/base/path/to/folder/test", "file2");

      expect(csv).toEqual([
        HEADER,
        ["/test", "test", 1603, LAST_MODIFIED_2, "", "", [], "", false],
        [
          "/test/file1",
          "file1",
          240,
          LAST_MODIFIED_1,
          "",
          "",
          [],
          `hash(${fullPath1})`,
          true
        ],
        [
          "/test/file2",
          "file2",
          1403,
          LAST_MODIFIED_2,
          "",
          "",
          [],
          `hash(${fullPath2})`,
          true
        ]
      ]);
    });
  });
});
