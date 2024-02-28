import {
  countFileSizes,
  countFileTypes,
  formatAuditReportDate,
  getBiggestFiles,
  getElementsToDelete,
  getLongestPathFile,
  getOldestFiles,
  percentFileTypes,
  sortFilesByLastModifiedDate,
  sortFilesBySize,
} from "@renderer/exporters/audit/audit-report-values-computer";
import { createFilesAndFoldersMetadata } from "@renderer/reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { bytes2HumanReadableFormat } from "@renderer/utils";
import { formatPathForUserSystem } from "@renderer/utils/file-system/file-sys-util";
import { FileType } from "@renderer/utils/file-types";

import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";

const folderId1 = "folder-id-1";
const folderId2 = `${folderId1}/folder-id-2`;
const fileName1 = "file-id-1.xml";
const fileName2 = "file-id-2.ppt";
const fileName3 = "file-id-31.docx";
const fileId1 = `${folderId1}/${fileName1}`;
const fileId2 = `${folderId2}/${fileName2}`;
const fileId3 = `${folderId2}/${fileName3}`;
const file1 = createFilesAndFolders({
  file_last_modified: 1531670400000,
  file_size: 1000,
  id: fileId1,
  name: fileName1,
});

const file2 = createFilesAndFolders({
  file_last_modified: 900277200000,
  file_size: 5000,
  id: fileId2,
  name: fileName2,
});

const file3 = createFilesAndFolders({
  file_last_modified: 962568000000,
  file_size: 2000,
  id: fileId3,
  name: fileName3,
});

const sortingTestArray = [
  file1,
  file1,
  file2,
  file3,
  file3,
  file3,
  file2,
  file1,
  file2,
];

const filesAndFoldersMap = {
  "": createFilesAndFolders({ children: [folderId1], id: "" }),
  [fileId1]: file1,
  [fileId2]: file2,
  [fileId3]: file3,
  [folderId1]: createFilesAndFolders({
    children: [folderId2, fileId1],
    id: folderId1,
  }),
  [folderId2]: createFilesAndFolders({
    children: [fileId2, fileId3],
    id: folderId2,
  }),
};

const filesAndFoldersMetadataMap = {
  "": createFilesAndFoldersMetadata({
    childrenTotalSize: 3000,
    maxLastModified: 3000,
  }),
  [fileId1]: createFilesAndFoldersMetadata({
    childrenTotalSize: 3000,
    maxLastModified: 3000,
  }),
  [fileId2]: createFilesAndFoldersMetadata({
    childrenTotalSize: 3000,
    maxLastModified: 3000,
  }),
  [fileId3]: createFilesAndFoldersMetadata({
    childrenTotalSize: 0,
    maxLastModified: 0,
  }),
  [folderId1]: createFilesAndFoldersMetadata({
    childrenTotalSize: 3000,
    maxLastModified: 3000,
  }),
  [folderId2]: createFilesAndFoldersMetadata({
    childrenTotalSize: 3000,
    maxLastModified: 3000,
  }),
};

describe("audit-report-values-computer", () => {
  describe("getLongestPathFile", () => {
    it("should count folders only in a filesAndFoldersMap", () => {
      expect(getLongestPathFile(filesAndFoldersMap)).toEqual(file3);
    });
  });

  describe("countFileTypes", () => {
    it("should count each file type", () => {
      expect(countFileTypes(filesAndFoldersMap)).toEqual({
        [FileType.PUBLICATION]: 0,
        [FileType.PRESENTATION]: 1,
        [FileType.SPREADSHEET]: 0,
        [FileType.EMAIL]: 0,
        [FileType.DOCUMENT]: 1,
        [FileType.IMAGE]: 0,
        [FileType.VIDEO]: 0,
        [FileType.AUDIO]: 0,
        [FileType.OTHER]: 0,
        [FileType.ARCHIVE]: 0,
        [FileType.DATA]: 1,
        [FileType.WEB]: 0,
      });
    });
  });

  describe("countFileSizes", () => {
    it("should count each file sizes sum", () => {
      expect(countFileSizes(filesAndFoldersMap)).toEqual({
        [FileType.PUBLICATION]: 0,
        [FileType.PRESENTATION]: 5000,
        [FileType.SPREADSHEET]: 0,
        [FileType.EMAIL]: 0,
        [FileType.DOCUMENT]: 2000,
        [FileType.IMAGE]: 0,
        [FileType.VIDEO]: 0,
        [FileType.AUDIO]: 0,
        [FileType.OTHER]: 0,
        [FileType.ARCHIVE]: 0,
        [FileType.DATA]: 1000,
        [FileType.WEB]: 0,
      });
    });
  });

  describe("percentFileTypes", () => {
    it("should count each file type", () => {
      expect(percentFileTypes(filesAndFoldersMap)).toEqual({
        [FileType.PUBLICATION]: 0,
        [FileType.PRESENTATION]: 33.33,
        [FileType.SPREADSHEET]: 0,
        [FileType.EMAIL]: 0,
        [FileType.DOCUMENT]: 33.33,
        [FileType.IMAGE]: 0,
        [FileType.VIDEO]: 0,
        [FileType.AUDIO]: 0,
        [FileType.OTHER]: 0,
        [FileType.ARCHIVE]: 0,
        [FileType.DATA]: 33.33,
        [FileType.WEB]: 0,
      });
    });
  });

  describe("sortFilesByLastModifiedDate", () => {
    it("should sort the elements", () => {
      expect(sortFilesByLastModifiedDate([file1, file2, file3])).toEqual([
        file2,
        file3,
        file1,
      ]);
    });
  });

  describe("getOldestFiles", () => {
    it("should return the description of the oldest files", () => {
      const file2Description = {
        date: formatAuditReportDate(file2.file_last_modified),
        name: file2.name,
        path: formatPathForUserSystem(file2.id),
      };

      const file3Description = {
        date: formatAuditReportDate(file3.file_last_modified),
        name: file3.name,
        path: formatPathForUserSystem(file3.id),
      };
      expect(getOldestFiles(sortingTestArray)).toEqual([
        file2Description,
        file2Description,
        file2Description,
        file3Description,
        file3Description,
      ]);
    });
  });

  describe("sortFilesBySize", () => {
    it("should return the sorted files", () => {
      expect(sortFilesBySize([file1, file2, file3])).toEqual([
        file1,
        file3,
        file2,
      ]);
    });
  });

  describe("getBiggestFiles", () => {
    it("should return the description of the oldest files", () => {
      const file2Description = {
        name: file2.name,
        path: formatPathForUserSystem(file2.id),
        size: bytes2HumanReadableFormat(file2.file_size),
      };

      const file3Description = {
        name: file3.name,
        path: formatPathForUserSystem(file3.id),
        size: bytes2HumanReadableFormat(file3.file_size),
      };
      expect(getBiggestFiles(sortingTestArray)).toEqual([
        file2Description,
        file2Description,
        file2Description,
        file3Description,
        file3Description,
      ]);
    });
  });

  describe("getElementsToDelete", () => {
    it("should return the list of elements to delete", () => {
      expect(
        getElementsToDelete(filesAndFoldersMap, filesAndFoldersMetadataMap, [
          folderId2,
          fileId1,
        ])
      ).toEqual([
        {
          date: "01/01/1970",
          name: "base-name",
          path: formatPathForUserSystem(folderId2),
          size: "2.9 kB",
          type: "folder",
        },
        {
          date: "01/01/1970",
          name: fileName1,
          path: formatPathForUserSystem(fileId1),
          size: "2.9 kB",
          type: "file",
        },
      ]);
    });
  });
});
