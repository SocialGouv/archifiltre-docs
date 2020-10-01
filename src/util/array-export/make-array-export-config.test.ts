import { createTag } from "reducers/tags/tags-test-util";
import { makeRowConfig } from "util/array-export/make-array-export-config";
import { createFilesAndFolders } from "reducers/files-and-folders/files-and-folders-test-utils";
import { createFilesAndFoldersMetadata } from "reducers/files-and-folders-metadata/files-and-folders-metadata-test-utils";
import { formatPathForUserSystem } from "util/file-system/file-sys-util";

const rowId = "/filesAndFolders/file-1";
const fileName = "file-name.csv";
const fileSize = 1300;
const firstModification = 900277200000;
const lastModification = 1531670400000;

const tags = {
  taggy: createTag({
    id: "taggy ",
    name: "Taggy",
    ffIds: [rowId],
  }),
};

const hashes = {
  [rowId]: "row-hash",
  "another-hash": "row-hash",
  "non-duplicate": "other-hash",
};

const aliases = {
  [rowId]: "row-alias",
};

const comments = {
  [rowId]: "row-comments",
};

const idsToDelete = [rowId];

const rowData = {
  ...createFilesAndFolders({
    id: rowId,
    name: fileName,
    virtualPath: "newFolder/file1",
  }),
  ...createFilesAndFoldersMetadata({
    childrenTotalSize: fileSize,
    minLastModified: firstModification,
    maxLastModified: lastModification,
    nbChildrenFiles: 1,
  }),
  tags,
  hashes,
  aliases,
  comments,
  idsToDelete,
};

describe("make-array-export-config", () => {
  describe("makeRowConfig", () => {
    const translator = (translationKey: string) =>
      `translate(${translationKey})`;

    const config = makeRowConfig(translator, tags);

    it("should return the file path", () => {
      const filePathConfig = config[1];

      expect(filePathConfig.title).toEqual(translator("csvHeader.path"));
      expect(filePathConfig.accessor(rowData)).toEqual(
        formatPathForUserSystem(rowId)
      );
    });

    it("should return the path length", () => {
      const filePathConfig = config[2];

      expect(filePathConfig.title).toEqual(translator("csvHeader.pathLength"));
      expect(filePathConfig.accessor(rowData)).toEqual("23");
    });

    it("should return the file name", () => {
      const filePathConfig = config[3];

      expect(filePathConfig.title).toEqual(translator("csvHeader.name"));
      expect(filePathConfig.accessor(rowData)).toEqual(fileName);
    });

    it("should return the file extension", () => {
      const filePathConfig = config[4];

      expect(filePathConfig.title).toEqual(translator("csvHeader.extension"));
      expect(filePathConfig.accessor(rowData)).toEqual(".csv");
    });

    it("should return the file size", () => {
      const filePathConfig = config[5];

      expect(filePathConfig.title).toEqual(translator("csvHeader.size"));
      expect(filePathConfig.accessor(rowData)).toEqual("1300");
    });

    it("should return the file first modification date", () => {
      const filePathConfig = config[6];

      expect(filePathConfig.title).toEqual(
        translator("csvHeader.firstModified")
      );
      expect(filePathConfig.accessor(rowData)).toEqual("12/07/1998");
    });

    it("should return the file last modification date", () => {
      const filePathConfig = config[7];

      expect(filePathConfig.title).toEqual(
        translator("csvHeader.lastModified")
      );
      expect(filePathConfig.accessor(rowData)).toEqual("15/07/2018");
    });

    it("should return the moved file path", () => {
      const filePathConfig = config[8];

      expect(filePathConfig.title).toEqual(translator("csvHeader.newPath"));
      expect(filePathConfig.accessor(rowData)).toEqual("newFolder/file1");
    });

    it("should return the file alias", () => {
      const filePathConfig = config[9];

      expect(filePathConfig.title).toEqual(translator("csvHeader.newName"));
      expect(filePathConfig.accessor(rowData)).toEqual("row-alias");
    });

    it("should return the file description", () => {
      const filePathConfig = config[10];

      expect(filePathConfig.title).toEqual(translator("csvHeader.description"));
      expect(filePathConfig.accessor(rowData)).toEqual("row-comments");
    });

    describe("fileOrFolder value", () => {
      it("for a file", () => {
        const filePathConfig = config[11];

        expect(filePathConfig.title).toEqual(
          translator("csvHeader.fileOrFolder")
        );
        expect(filePathConfig.accessor(rowData)).toEqual(
          translator("common.file")
        );
      });

      it("for a folder", () => {
        const filePathConfig = config[11];

        expect(filePathConfig.title).toEqual(
          translator("csvHeader.fileOrFolder")
        );
        expect(
          filePathConfig.accessor({ ...rowData, children: ["child"] })
        ).toEqual(translator("common.folder"));
      });
    });

    it("should return the depth", () => {
      const filePathConfig = config[12];

      expect(filePathConfig.title).toEqual(translator("csvHeader.depth"));
      expect(filePathConfig.accessor(rowData)).toEqual("1");
    });

    it("should return the fileCount", () => {
      const filePathConfig = config[13];

      expect(filePathConfig.title).toEqual(translator("csvHeader.fileCount"));
      expect(filePathConfig.accessor(rowData)).toEqual("1");
    });

    describe("type", () => {
      it("should detect folders", () => {
        const filePathConfig = config[14];

        expect(filePathConfig.title).toEqual(translator("csvHeader.type"));
        expect(
          filePathConfig.accessor({ ...rowData, children: ["child"] })
        ).toEqual(translator("common.folder"));
      });

      it("should detect csv", () => {
        const filePathConfig = config[14];

        expect(filePathConfig.title).toEqual(translator("csvHeader.type"));
        expect(
          filePathConfig.accessor({ ...rowData, id: "/parent/file.csv" })
        ).toEqual("csv");
      });

      it("should detect unknown", () => {
        const filePathConfig = config[14];

        expect(filePathConfig.title).toEqual(translator("csvHeader.type"));
        expect(filePathConfig.accessor(rowData)).toEqual(
          translator("common.unknown")
        );
      });
    });

    it("should return the hash", () => {
      const filePathConfig = config[15];

      expect(filePathConfig.title).toEqual(translator("csvHeader.hash"));
      expect(filePathConfig.accessor(rowData)).toEqual("row-hash");
    });

    describe("duplicate", () => {
      it("should find duplicates", () => {
        const filePathConfig = config[16];

        expect(filePathConfig.title).toEqual(translator("csvHeader.duplicate"));
        expect(filePathConfig.accessor(rowData)).toEqual(
          translator("common.yes")
        );
      });

      it("should find non-duplicates", () => {
        const filePathConfig = config[16];

        expect(filePathConfig.title).toEqual(translator("csvHeader.duplicate"));
        expect(
          filePathConfig.accessor({ ...rowData, id: "non-duplicate" })
        ).toEqual(translator("common.no"));
      });
    });

    it("should set toDelete status", () => {
      const filePathConfig = config[17];

      expect(filePathConfig.title).toEqual(translator("csvHeader.toDelete"));
      expect(filePathConfig.accessor(rowData)).toEqual(
        translator("common.toDelete")
      );
    });

    it("should fill tags", () => {
      const filePathConfig = config[18];

      expect(filePathConfig.title).toEqual("tag0 : Taggy");
      expect(filePathConfig.accessor(rowData)).toEqual("Taggy");
    });
  });
});
