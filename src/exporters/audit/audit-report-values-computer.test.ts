import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";
import { getLongestPathFile } from "./audit-report-values-computer";

const folderId1 = "folder-id-1";
const folderId2 = `${folderId1}/folder-id-2`;
const fileId1 = `${folderId1}/file-id-1`;
const fileId2 = `${folderId2}/file-id-2`;
const fileId3 = `${folderId2}/file-id-31`;

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
  [fileId1]: createFilesAndFolders({ id: fileId1 }),
  [fileId2]: createFilesAndFolders({ id: fileId2 }),
  [fileId3]: createFilesAndFolders({ id: fileId3 })
};

describe("audit-report-values-computer", () => {
  describe("getLongestPathFile", () => {
    it("should count folders only in a filesAndFoldersMap", () => {
      expect(getLongestPathFile(filesAndFoldersMap)).toEqual(
        createFilesAndFolders({ id: fileId3 })
      );
    });
  });
});
