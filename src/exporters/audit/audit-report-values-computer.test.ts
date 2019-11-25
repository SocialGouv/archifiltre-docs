import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";
import { FileType } from "../../util/file-types-util";
import {
  countFileTypes,
  getLongestPathFile,
  percentFileTypes
} from "./audit-report-values-computer";

const folderId1 = "folder-id-1";
const folderId2 = `${folderId1}/folder-id-2`;
const fileName1 = "file-id-1.xml";
const fileName2 = "file-id-2.ppt";
const fileName3 = "file-id-31.docx";
const fileId1 = `${folderId1}/${fileName1}`;
const fileId2 = `${folderId2}/${fileName2}`;
const fileId3 = `${folderId2}/${fileName3}`;

const filesAndFoldersMap = {
  "": createFilesAndFolders({ id: "", children: [folderId1] }),
  [folderId1]: createFilesAndFolders({
    children: [folderId2, fileId1],
    id: folderId1
  }),
  [folderId2]: createFilesAndFolders({
    children: [fileId2, fileId3],
    id: folderId2
  }),
  [fileId1]: createFilesAndFolders({ id: fileId1, name: fileName1 }),
  [fileId2]: createFilesAndFolders({ id: fileId2, name: fileName2 }),
  [fileId3]: createFilesAndFolders({ id: fileId3, name: fileName3 })
};

describe("audit-report-values-computer", () => {
  describe("getLongestPathFile", () => {
    it("should count folders only in a filesAndFoldersMap", () => {
      expect(getLongestPathFile(filesAndFoldersMap)).toEqual(
        createFilesAndFolders({ id: fileId3, name: fileName3 })
      );
    });
  });

  describe("countFileTypes", () => {
    it("should count each file type", () => {
      expect(countFileTypes(filesAndFoldersMap)).toEqual({
        [FileType.PRESENTATION]: 1,
        [FileType.MEDIA]: 0,
        [FileType.DOCUMENT]: 1,
        [FileType.EMAIL]: 0,
        [FileType.SPREADSHEET]: 0,
        [FileType.OTHER]: 1
      });
    });
  });

  describe("percentFileTypes", () => {
    it("should count each file type", () => {
      expect(percentFileTypes(filesAndFoldersMap)).toEqual({
        [FileType.PRESENTATION]: 33.33,
        [FileType.MEDIA]: 0,
        [FileType.DOCUMENT]: 33.33,
        [FileType.EMAIL]: 0,
        [FileType.SPREADSHEET]: 0,
        [FileType.OTHER]: 33.33
      });
    });
  });
});
