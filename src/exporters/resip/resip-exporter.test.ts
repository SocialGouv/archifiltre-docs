import { advanceTo } from "jest-date-mock";

import { ROOT_FF_ID } from "../../reducers/files-and-folders/files-and-folders-selectors";
import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";
import { createFilesAndFoldersMetadata } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { createTag } from "../../reducers/tags/tags-test-util";
import { formatPathForUserSystem } from "../../util/file-system/file-sys-util";
import { resipExporter } from "./resip-exporter";

// We advance to a specific date for TransactedDate to be setup correctly
advanceTo("2019-08-05");

const rootFolderId = "/root-folder";
const rootFolderName = "root-folder";
const file1Id = "/root-folder/file1-name";
const file1Name = "file1-name";
const folder1Id = "/root-folder/folder1-name";
const folder1Name = "folder1-name";
const folder1Comments = "folder-1-comments";
const folder1LastModifiedMin = Date.parse("12 Jul 1998");
const folder1LastModifiedMax = Date.parse("15 Jul 2018");
const file2Id = "/root-folder/folder1-name/file2-name";
const file2Name = "file2-name";
const file2Alias = "file2-alias";
const movedFileId = "/root-folder/folder1-name/moved-file-name";
const movedFileVirtualPath = "/root-folder/moved-file-name";
const folderToDeleteId = "folder-to-delete-id";
const fileToDeleteId = "folder-to-delete-id";
const tag1Id = "tag-1-id";
const tag1Name = "tag-1-name";

const filesAndFolders = {
  [ROOT_FF_ID]: createFilesAndFolders({
    children: [rootFolderId],
    id: ROOT_FF_ID,
  }),
  [file1Id]: createFilesAndFolders({
    id: file1Id,
  }),
  [file2Id]: createFilesAndFolders({
    id: file2Id,
    name: file2Name,
  }),
  [fileToDeleteId]: createFilesAndFolders({ id: fileToDeleteId }),
  [folder1Id]: createFilesAndFolders({
    children: [file2Id],
    id: folder1Id,
  }),
  [folderToDeleteId]: createFilesAndFolders({
    children: [fileToDeleteId],
    id: folderToDeleteId,
  }),
  [movedFileId]: createFilesAndFolders({
    id: movedFileId,
    virtualPath: movedFileVirtualPath,
  }),
  [rootFolderId]: createFilesAndFolders({
    children: [file1Id, folder1Id, movedFileId],
    id: rootFolderId,
  }),
};

const filesAndFoldersMetadata = {
  [ROOT_FF_ID]: createFilesAndFoldersMetadata({}),
  [file1Id]: createFilesAndFoldersMetadata({}),
  [file2Id]: createFilesAndFoldersMetadata({}),
  [folder1Id]: createFilesAndFoldersMetadata({
    maxLastModified: folder1LastModifiedMax,
    minLastModified: folder1LastModifiedMin,
  }),
  [movedFileId]: createFilesAndFoldersMetadata({}),
  [rootFolderId]: createFilesAndFoldersMetadata({}),
};

const tags = {
  [tag1Id]: createTag({ ffIds: [file1Id], id: tag1Id, name: tag1Name }),
};

const aliases = {
  [file2Id]: file2Alias,
};

const comments = {
  [folder1Id]: folder1Comments,
};

const elementsToDelete = [folderToDeleteId];

describe("resip-exporter", () => {
  describe("with a simple file structure", () => {
    it("should format the right csv", () => {
      expect(
        resipExporter({
          aliases,
          comments,
          elementsToDelete,
          filesAndFolders,
          filesAndFoldersMetadata,
          tags,
        })
      ).toEqual([
        [
          "ID",
          "ParentID",
          "File",
          "DescriptionLevel",
          "Title",
          "StartDate",
          "EndDate",
          "TransactedDate",
          "CustodialHistory.CustodialHistoryItem",
          "Description",
          "Content.Tag.0",
        ],
        [
          "1",
          "",
          ".",
          "RecordGrp",
          rootFolderName,
          "2019-08-05",
          "2019-08-05",
          "2019-08-05",
          "",
          "",
          "",
        ],
        [
          "2",
          "1",
          "file1-name",
          "Item",
          file1Name,
          "2019-08-05",
          "2019-08-05",
          "2019-08-05",
          "",
          "",
          "tag-1-name",
        ],
        [
          "3",
          "1",
          "folder1-name",
          "RecordGrp",
          folder1Name,
          "1998-07-12",
          "2018-07-15",
          "2019-08-05",
          "",
          folder1Comments,
          "",
        ],
        [
          "4",
          "3",
          `${formatPathForUserSystem("folder1-name/file2-name")}`,
          "Item",
          file2Alias,
          "2019-08-05",
          "2019-08-05",
          "2019-08-05",
          `This element original title was '${file2Name}'`,
          "",
          "",
        ],
        [
          "5",
          "1",
          "folder1-name/moved-file-name",
          "Item",
          "moved-file-name",
          "2019-08-05",
          "2019-08-05",
          "2019-08-05",
          "",
          "",
          "",
        ],
      ]);
    });
  });
});
