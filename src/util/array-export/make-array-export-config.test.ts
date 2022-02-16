/* eslint-disable jest/expect-expect */
import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";
import { createFilesAndFoldersMetadata } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { createTag } from "../../reducers/tags/tags-test-util";
import { formatPathForUserSystem } from "../file-system/file-sys-util";
import { makeRowConfig } from "./make-array-export-config";

const rowId = "/filesAndFolders/file-1";
const fileName = "file-name.csv";
const fileSize = 1300;
const firstModification = 900277200000;
const newModification = 962568000000;
const lastModification = 1531670400000;

const tags = {
  taggy: createTag({
    ffIds: [rowId],
    id: "taggy ",
    name: "Taggy",
  }),
};

const hashes = {
  "another-hash": "row-hash",
  "non-duplicate": "other-hash",
  [rowId]: "row-hash",
};

const aliases = {
  [rowId]: "row-alias",
};

const comments = {
  [rowId]: "row-comments",
};

const idsToDelete = [rowId];

const rowDataSample = {
  ...createFilesAndFolders({
    id: rowId,
    name: fileName,
    virtualPath: "newFolder/file1",
  }),
  ...createFilesAndFoldersMetadata({
    childrenTotalSize: fileSize,
    maxLastModified: lastModification,
    minLastModified: firstModification,
    nbChildrenFiles: 1,
  }),
  aliases,
  comments,
  hashes,
  idsToDelete,
  overrideLastModified: {},
  tags,
};

describe("make-array-export-config", () => {
  describe("makeRowConfig", () => {
    const translator = (translationKey: string) =>
      `translate(${translationKey})`;

    const rowConfig = makeRowConfig(translator, tags);

    const makeTestRow =
      ({ rowData, config }) =>
      ({ columnLabel, expectedValue }) => {
        const title = translator(columnLabel);
        const columnConfig = config.find((c) => c.title === title);
        expect(columnConfig?.accessor(rowData)).toEqual(expectedValue);
      };

    const testRow = makeTestRow({
      config: rowConfig,
      rowData: rowDataSample,
    });

    it("should return the file path", () => {
      testRow({
        columnLabel: "csvHeader.path",
        expectedValue: formatPathForUserSystem(rowId),
      });
    });

    it("should return the path length", () => {
      testRow({
        columnLabel: "csvHeader.pathLength",
        expectedValue: "23",
      });
    });

    it("should return the file name", () => {
      testRow({
        columnLabel: "csvHeader.name",
        expectedValue: fileName,
      });
    });

    it("should return the file extension", () => {
      testRow({
        columnLabel: "csvHeader.extension",
        expectedValue: ".csv",
      });
    });

    it("should return the file size", () => {
      testRow({
        columnLabel: "csvHeader.size",
        expectedValue: "1300",
      });
    });

    it("should return the file first modification date", () => {
      testRow({
        columnLabel: "csvHeader.firstModified",
        expectedValue: "12/07/1998",
      });
    });

    it("should return the file last modification date", () => {
      testRow({
        columnLabel: "csvHeader.lastModified",
        expectedValue: "15/07/2018",
      });
    });

    it("should return the moved file path", () => {
      testRow({
        columnLabel: "csvHeader.newPath",
        expectedValue: "newFolder/file1",
      });
    });

    it("should return the file alias", () => {
      testRow({
        columnLabel: "csvHeader.newName",
        expectedValue: "row-alias",
      });
    });

    it("should return the file description", () => {
      testRow({
        columnLabel: "csvHeader.description",
        expectedValue: "row-comments",
      });
    });

    describe("fileOrFolder value", () => {
      it("for a file", () => {
        testRow({
          columnLabel: "csvHeader.fileOrFolder",
          expectedValue: translator("common.fileWord"),
        });
      });

      it("for a folder", () => {
        const customTestRow = makeTestRow({
          config: rowConfig,
          rowData: { ...rowDataSample, children: ["child"] },
        });
        customTestRow({
          columnLabel: "csvHeader.fileOrFolder",
          expectedValue: translator("common.folder"),
        });
      });
    });

    it("should return the depth", () => {
      testRow({
        columnLabel: "csvHeader.depth",
        expectedValue: "1",
      });
    });

    it("should return the fileCount", () => {
      testRow({
        columnLabel: "csvHeader.fileCount",
        expectedValue: "1",
      });
    });

    describe("type", () => {
      it("should detect folders", () => {
        const customTester = makeTestRow({
          config: rowConfig,
          rowData: { ...rowDataSample, children: ["child"] },
        });
        customTester({
          columnLabel: "csvHeader.type",
          expectedValue: translator("common.folder"),
        });
      });

      it("should detect csv", () => {
        const customTester = makeTestRow({
          config: rowConfig,
          rowData: { ...rowDataSample, id: "/parent/file.csv" },
        });
        customTester({
          columnLabel: "csvHeader.type",
          expectedValue: "csv",
        });
      });

      it("should detect unknown", () => {
        testRow({
          columnLabel: "csvHeader.type",
          expectedValue: translator("common.unknown"),
        });
      });
    });

    it("should return the hash", () => {
      testRow({
        columnLabel: "csvHeader.hash",
        expectedValue: "row-hash",
      });
    });

    describe("duplicate", () => {
      it("should find duplicates", () => {
        testRow({
          columnLabel: "csvHeader.duplicate",
          expectedValue: translator("common.yes"),
        });
      });

      it("should find non-duplicates", () => {
        const customTestRow = makeTestRow({
          config: rowConfig,
          rowData: { ...rowDataSample, id: "non-duplicate" },
        });
        customTestRow({
          columnLabel: "csvHeader.duplicate",
          expectedValue: translator("common.no"),
        });
      });
    });

    it("should set toDelete status", () => {
      testRow({
        columnLabel: "csvHeader.toDelete",
        expectedValue: translator("common.toDelete"),
      });
    });

    describe("newFirstModified", () => {
      it("should be ignored if equal to firstModified", () => {
        testRow({
          columnLabel: "csvHeader.newFirstModified",
          expectedValue: "",
        });
      });

      it("should be displayed if different from first modified", () => {
        const columnConfig = rowConfig.find(
          (config) => config.title === translator("csvHeader.newFirstModified")
        );
        expect(
          columnConfig?.accessor({
            ...rowDataSample,
            minLastModified: newModification,
          })
        ).toEqual("02/07/2000");
      });
    });

    describe("newLastModified", () => {
      it("should be ignored if equal to lastModified", () => {
        testRow({
          columnLabel: "csvHeader.newLastModified",
          expectedValue: "",
        });
      });

      it("should be displayed if different from last modified", () => {
        const columnConfig = rowConfig.find(
          (config) => config.title === translator("csvHeader.newLastModified")
        );
        expect(
          columnConfig?.accessor({
            ...rowDataSample,
            maxLastModified: newModification,
          })
        ).toEqual("02/07/2000");
      });
    });

    it("should fill tags", () => {
      const columnConfig = rowConfig.find(
        (config) => config.title === "tag0 : Taggy"
      );
      expect(columnConfig?.accessor(rowDataSample)).toEqual("Taggy");
    });
  });
});
