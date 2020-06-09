import { createFilesAndFoldersMetadata } from "reducers/files-and-folders-metadata/files-and-folders-metadata-test-utils";
import { createFilesAndFolders } from "reducers/files-and-folders/files-and-folders-test-utils";
import { FileType } from "../file-types/file-types-util";
import {
  countDuplicateFiles,
  countDuplicateFileSizes,
  countDuplicateFilesTotalSize,
  countDuplicateFileTypes,
  countDuplicateFolders,
  countDuplicatesPercentForFiles,
  countDuplicatesPercentForFolders,
  getBiggestDuplicatedFolders,
  getFilesDuplicatesMap,
  getMostDuplicatedFiles,
  hasDuplicate,
} from "./duplicates-util";

const folder1Id = "folder-1-id";
const folder2Id = "folder-2-id";
const file1Id = "file-1-id";
const file2Id = "file-2-id";
const file3Id = `${folder2Id}/file-3-id`;
const file4Id = `${folder2Id}/file-4-id`;
const file5Id = `${folder1Id}/file-5-id`;
const file6Id = `${folder1Id}/file-6-id`;
const hash1 = "first-hash-value";
const hash2 = "second-hash-value";
const hash3 = "third-hash-value";
const folderHash = "folder-1-hash";
const file1Size = 1000;
const file5Size = 2500;
const file1 = createFilesAndFolders({
  file_size: file1Size,
  id: file1Id,
});
const file2 = createFilesAndFolders({
  file_size: 2000,
  id: file2Id,
});
const file3 = createFilesAndFolders({
  file_size: file1Size,
  id: file3Id,
});
const file4 = createFilesAndFolders({
  file_size: file1Size,
  id: file4Id,
});

const file5 = createFilesAndFolders({
  file_size: file5Size,
  id: file5Id,
});

const file6 = createFilesAndFolders({
  file_size: file5Size,
  id: file6Id,
});

const folder1 = createFilesAndFolders({
  children: [file5Id, file6Id],
  id: folder1Id,
});

const folder2 = createFilesAndFolders({
  children: [file5Id, file6Id],
  id: folder2Id,
});

const file1WithHash = { ...file1, hash: hash1 };
const file3WithHash = { ...file3, hash: hash1 };
const file4WithHash = { ...file4, hash: hash1 };
const file5WithHash = { ...file5, hash: hash3 };
const file6WithHash = { ...file6, hash: hash3 };

const filesMap = {
  [file1Id]: file1,
  [file2Id]: file2,
  [file3Id]: file3,
  [file4Id]: file4,
  [file5Id]: file5,
  [file6Id]: file6,
  [folder1Id]: folder1,
  [folder2Id]: folder2,
};

const metadataMap = {
  [file1Id]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 1570615679168,
    medianLastModified: 4000,
    minLastModified: 1000,
  }),
  [file2Id]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 1000,
    maxLastModified: 10000,
    medianLastModified: 4000,
    minLastModified: 1000,
  }),
  [file3Id]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 1000,
    maxLastModified: 10000,
    medianLastModified: 4000,
    minLastModified: 1000,
  }),
  [file4Id]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 1570615679168,
    medianLastModified: 4000,
    minLastModified: 1000,
  }),
  [file5Id]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 1000,
    maxLastModified: 10000,
    medianLastModified: 4000,
    minLastModified: 1000,
  }),
  [file6Id]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 1000,
    maxLastModified: 10000,
    medianLastModified: 4000,
    minLastModified: 1000,
  }),
  [folder1Id]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 1000,
    maxLastModified: 10000,
    medianLastModified: 4000,
    minLastModified: 1000,
  }),
  [folder2Id]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 1000,
    maxLastModified: 10000,
    medianLastModified: 4000,
    minLastModified: 1000,
  }),
};

const hashesMap = {
  [file1Id]: hash1,
  [file2Id]: hash2,
  [file3Id]: hash1,
  [file4Id]: hash1,
  [file5Id]: hash3,
  [file6Id]: hash3,
  [folder1Id]: folderHash,
  [folder2Id]: folderHash,
};

const csvFileId = "csv-file-id";
const imgFileId = "img-file-id";
const csvFile2Id = "csv-file-2-id";
const imgFile2Id = "img-file-2-id";
const csvFileName = "csv-file.csv";
const imgFileName = "img-file.jpg";
const csvHash = "first-hash-value";
const imgHash = "second-hash-value";
const csvFileSize = 4000;
const imgFileSize = 200;
const csvFile = createFilesAndFolders({
  file_size: csvFileSize,
  id: csvFileId,
  name: csvFileName,
});
const imgFile = createFilesAndFolders({
  file_size: imgFileSize,
  id: imgFileId,
  name: imgFileName,
});
const csvFile2 = createFilesAndFolders({
  file_size: csvFileSize,
  id: csvFile2Id,
  name: csvFileName,
});
const imgFile2 = createFilesAndFolders({
  file_size: imgFileSize,
  id: imgFile2Id,
  name: imgFileName,
});

describe("duplicates-util", () => {
  describe("countDuplicateFiles", () => {
    it("should count the number of duplicates", () => {
      expect(countDuplicateFiles(filesMap, hashesMap)).toEqual(3);
    });
  });

  describe("countDuplicateFolders", () => {
    it("should count the number of duplicates", () => {
      expect(countDuplicateFolders(filesMap, hashesMap)).toEqual(1);
    });
  });

  describe("countDuplicatesPercentForFiles", () => {
    it("should count the percent of duplicates", () => {
      expect(countDuplicatesPercentForFiles(filesMap, hashesMap)).toEqual(
        3 / 6
      );
    });
  });

  describe("countDuplicatesPercentForFolders", () => {
    it("should count the percent of duplicates", () => {
      expect(countDuplicatesPercentForFolders(filesMap, hashesMap)).toEqual(
        1 / 2
      );
    });
  });

  describe("countDuplicateFilesTotalSize", () => {
    it("should count the totalSize of duplicates", () => {
      expect(countDuplicateFilesTotalSize(filesMap, hashesMap)).toEqual(
        2 * file1Size + file5Size
      );
    });
  });

  describe("getMostDuplicatedFiles", () => {
    it("should only return the duplicated items if too many are required", () => {
      expect(getMostDuplicatedFiles(3)(filesMap, hashesMap)).toEqual([
        [file1WithHash, file3WithHash, file4WithHash],
        [file5WithHash, file6WithHash],
      ]);
    });

    it("should not return too many duplicated items", () => {
      expect(getMostDuplicatedFiles(1)(filesMap, hashesMap)).toEqual([
        [file1WithHash, file3WithHash, file4WithHash],
      ]);
    });
  });

  describe("getBiggestDuplicatedFolders", () => {
    it("should only return the duplicated items if too many are required", () => {
      const biggestDuplicatedFolders = getBiggestDuplicatedFolders(3)(
        filesMap,
        metadataMap,
        hashesMap
      );
      expect(biggestDuplicatedFolders.length).toBe(1);
      expect(biggestDuplicatedFolders[0]).toEqual({
        averageLastModified: 3000,
        children: ["folder-1-id/file-5-id", "folder-1-id/file-6-id"],
        childrenTotalSize: 1000,
        count: 2,
        file_last_modified: 0,
        file_size: 0,
        hash: "folder-1-hash",
        id: "folder-1-id",
        maxLastModified: 10000,
        medianLastModified: 4000,
        minLastModified: 1000,
        name: "base-name",
        nbChildrenFiles: 1,
        sortByDateIndex: [0],
        sortBySizeIndex: [0],
        virtualPath: "folder-1-id",
      });
    });

    it("should not return too many duplicated items", () => {
      expect(
        getBiggestDuplicatedFolders(1)(filesMap, metadataMap, hashesMap)
      ).toEqual([
        {
          averageLastModified: 3000,
          children: ["folder-1-id/file-5-id", "folder-1-id/file-6-id"],
          childrenTotalSize: 1000,
          count: 2,
          file_last_modified: 0,
          file_size: 0,
          hash: "folder-1-hash",
          id: "folder-1-id",
          maxLastModified: 10000,
          medianLastModified: 4000,
          minLastModified: 1000,
          name: "base-name",
          nbChildrenFiles: 1,
          sortByDateIndex: [0],
          sortBySizeIndex: [0],
          virtualPath: "folder-1-id",
        },
      ]);
    });
  });

  describe("hasDuplicate", () => {
    it("should return true if element has at least one duplicate", () => {
      expect(hasDuplicate(hashesMap, file1)).toEqual(true);
    });

    it("should return false if element has no duplicates", () => {
      expect(hasDuplicate(hashesMap, file2)).toEqual(false);
    });
  });

  describe("countDuplicateFileSizes", () => {
    it("should return the duplicates sizes grouped by type", () => {
      const duplicatesMap = getFilesDuplicatesMap(
        {
          ...filesMap,
          [csvFileId]: csvFile,
          [imgFileId]: imgFile,
          [csvFile2Id]: csvFile2,
          [imgFile2Id]: imgFile2,
        },
        {
          ...hashesMap,
          [csvFileId]: csvHash,
          [imgFileId]: imgHash,
          [csvFile2Id]: csvHash,
          [imgFile2Id]: imgHash,
        }
      );
      expect(countDuplicateFileSizes(duplicatesMap)).toEqual({
        [FileType.PUBLICATION]: 0,
        [FileType.PRESENTATION]: 0,
        [FileType.SPREADSHEET]: 10000,
        [FileType.EMAIL]: 0,
        [FileType.DOCUMENT]: 0,
        [FileType.IMAGE]: 400,
        [FileType.VIDEO]: 0,
        [FileType.AUDIO]: 0,
        [FileType.OTHER]: 2500,
      });
    });
  });

  describe("countDuplicateFileTypes", () => {
    it("should return the duplicates sizes grouped by type", () => {
      const duplicatesMap = getFilesDuplicatesMap(
        {
          ...filesMap,
          [csvFileId]: csvFile,
          [imgFileId]: imgFile,
          [csvFile2Id]: csvFile2,
          [imgFile2Id]: imgFile2,
        },
        {
          ...hashesMap,
          [csvFileId]: csvHash,
          [imgFileId]: imgHash,
          [csvFile2Id]: csvHash,
          [imgFile2Id]: imgHash,
        }
      );
      expect(countDuplicateFileTypes(duplicatesMap)).toEqual({
        [FileType.PUBLICATION]: 0,
        [FileType.PRESENTATION]: 0,
        [FileType.SPREADSHEET]: 4,
        [FileType.EMAIL]: 0,
        [FileType.DOCUMENT]: 0,
        [FileType.IMAGE]: 2,
        [FileType.VIDEO]: 0,
        [FileType.AUDIO]: 0,
        [FileType.OTHER]: 1,
      });
    });
  });
});
