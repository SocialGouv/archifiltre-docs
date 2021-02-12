import { createFilesAndFolders } from "reducers/files-and-folders/files-and-folders-test-utils";
import { formatPathForUserSystem } from "util/file-system/file-sys-util";
import { exportToCsv } from "util/array-export/array-export";
import { toArray } from "rxjs/operators";
import { flatten } from "lodash";
import { createFilesAndFoldersMetadata } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";

const tagName = "test-tag-1";
const rootFolderId = "/root";
const taggedFfId = "/root/folder";
const firstChildId = "/root/folder/ff-id.txt";
const firstChildVirtualPath = "/root/ff-id.txt";
const tagId = "test-tag-id";
const tagId2 = "test-tag-id-2";
const rootId = "";
const tag2Name = "tag2";
const tags = {
  [tagId]: {
    ffIds: [taggedFfId],
    id: tagId,
    name: tagName,
  },
  [tagId2]: {
    ffIds: [taggedFfId],
    id: tagId2,
    name: tag2Name,
  },
};

const filesAndFolders = {
  [rootId]: createFilesAndFolders({
    children: [rootFolderId],
    file_last_modified: 1571325669,
    file_size: 10,
    id: rootId,
    name: "",
  }),
  [rootFolderId]: createFilesAndFolders({
    children: [taggedFfId],
    file_last_modified: 1571325669,
    file_size: 10,
    id: rootFolderId,
    name: "root",
  }),
  [taggedFfId]: createFilesAndFolders({
    children: [firstChildId],
    file_last_modified: 1571325669,
    file_size: 10,
    id: taggedFfId,
    name: "folder",
  }),
  [firstChildId]: createFilesAndFolders({
    children: [],
    file_last_modified: 1571325669,
    file_size: 10,
    id: firstChildId,
    name: "ff-id.txt",
    virtualPath: firstChildVirtualPath,
  }),
};

const filesAndFoldersMetadata = {
  [rootFolderId]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 10000,
    medianLastModified: 4000,
    minLastModified: 1000,
  }),
  [taggedFfId]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 10000,
    medianLastModified: 4000,
    minLastModified: 1000,
  }),
  [firstChildId]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 10000,
    medianLastModified: 4000,
    minLastModified: 1000,
  }),
};

const rootHash = "root-tag";
const rootFolderHash = "root-folder-hash";
const taggedHash = "tagged-hash";
const firstChildIdHash = "tagged-hash";
const hashes = {
  [rootId]: rootHash,
  [rootFolderId]: rootFolderHash,
  [taggedFfId]: taggedHash,
  [firstChildId]: firstChildIdHash,
};

const rootAlias = "root-alias";
const firstChildIdAlias = "aliased-element";
const aliases = {
  [rootId]: rootAlias,
  [firstChildId]: firstChildIdAlias,
};

const rootComment = "root-comment";
const firstChildIdComment = "commented-element";
const comments = {
  [rootId]: rootComment,
  [firstChildId]: firstChildIdComment,
};

const translator = (key) => `translate(${key})`;

describe("array-export", () => {
  describe("exportToCsv", () => {
    it("should return the right array without hashes", async () => {
      const csvHeader = [
        "",
        "translate(csvHeader.path)",
        "translate(csvHeader.pathLength)",
        "translate(csvHeader.name)",
        "translate(csvHeader.extension)",
        "translate(csvHeader.size)",
        "translate(csvHeader.firstModified)",
        "translate(csvHeader.lastModified)",
        "translate(csvHeader.newFirstModified)",
        "translate(csvHeader.newLastModified)",
        "translate(csvHeader.newPath)",
        "translate(csvHeader.newName)",
        "translate(csvHeader.description)",
        "translate(csvHeader.fileOrFolder)",
        "translate(csvHeader.depth)",
        "translate(csvHeader.fileCount)",
        "translate(csvHeader.type)",
        `tag0 : ${tag2Name}`,
        `tag1 : ${tagName}`,
      ];
      const csvFirstLine = [
        "",
        `${formatPathForUserSystem(rootFolderId)}`,
        "5",
        "root",
        "",
        "10000",
        "01/01/1970",
        "01/01/1970",
        "",
        "",
        "",
        "",
        "",
        translator("common.folder"),
        "0",
        "1",
        translator("common.folder"),
        "",
        "",
      ];
      const csvSecondLine = [
        "",
        `${formatPathForUserSystem(taggedFfId)}`,
        "12",
        "folder",
        "",
        "10000",
        "01/01/1970",
        "01/01/1970",
        "",
        "",
        "",
        "",
        "",
        translator("common.folder"),
        "1",
        "1",
        translator("common.folder"),
        `${tag2Name}`,
        `${tagName}`,
      ];
      const csvThirdLine = [
        "",
        `${formatPathForUserSystem(firstChildId)}`,
        "22",
        "ff-id.txt",
        ".txt",
        "10000",
        "01/01/1970",
        "01/01/1970",
        "",
        "",
        `${formatPathForUserSystem(firstChildVirtualPath)}`,
        `${aliases[firstChildId]}`,
        `${comments[firstChildId]}`,
        translator("common.file"),
        "2",
        "1",
        "plain",
        `${tag2Name}`,
        `${tagName}`,
      ];
      const expectedCsv = [
        csvHeader,
        csvFirstLine,
        csvSecondLine,
        csvThirdLine,
      ];

      expect(
        await exportToCsv({
          aliases,
          comments,
          filesAndFolders,
          filesAndFoldersMetadata,
          tags,
          elementsToDelete: [],
          translator,
        })
          .pipe(toArray())
          .toPromise()
          .then(flatten)
      ).toEqual(expectedCsv);
    });

    it("should return the right csv with hashes", async () => {
      const csvHeader = [
        "",
        "translate(csvHeader.path)",
        "translate(csvHeader.pathLength)",
        "translate(csvHeader.name)",
        "translate(csvHeader.extension)",
        "translate(csvHeader.size)",
        "translate(csvHeader.firstModified)",
        "translate(csvHeader.lastModified)",
        "translate(csvHeader.newFirstModified)",
        "translate(csvHeader.newLastModified)",
        "translate(csvHeader.newPath)",
        "translate(csvHeader.newName)",
        "translate(csvHeader.description)",
        "translate(csvHeader.fileOrFolder)",
        "translate(csvHeader.depth)",
        "translate(csvHeader.fileCount)",
        "translate(csvHeader.type)",
        "translate(csvHeader.hash)",
        "translate(csvHeader.duplicate)",
        `tag0 : ${tag2Name}`,
        `tag1 : ${tagName}`,
      ];
      const csvFirstLine = [
        "",
        `${formatPathForUserSystem(rootFolderId)}`,
        "5",
        "root",
        "",
        "10000",
        "01/01/1970",
        "01/01/1970",
        "",
        "",
        "",
        "",
        "",
        translator("common.folder"),
        "0",
        "1",
        translator("common.folder"),
        rootFolderHash,
        translator("common.no"),
        "",
        "",
      ];
      const csvSecondLine = [
        "",
        `${formatPathForUserSystem(taggedFfId)}`,
        "12",
        "folder",
        "",
        "10000",
        "01/01/1970",
        "01/01/1970",
        "",
        "",
        "",
        "",
        "",
        translator("common.folder"),
        "1",
        "1",
        translator("common.folder"),
        taggedHash,
        translator("common.yes"),
        `${tag2Name}`,
        `${tagName}`,
      ];
      const csvThirdLine = [
        "",
        `${formatPathForUserSystem(firstChildId)}`,
        "22",
        "ff-id.txt",
        ".txt",
        "10000",
        "01/01/1970",
        "01/01/1970",
        "",
        "",
        `${formatPathForUserSystem(firstChildVirtualPath)}`,
        `${aliases[firstChildId]}`,
        `${comments[firstChildId]}`,
        translator("common.file"),
        "2",
        "1",
        "plain",
        firstChildIdHash,
        translator("common.yes"),
        `${tag2Name}`,
        `${tagName}`,
      ];
      const expectedCsv = [
        csvHeader,
        csvFirstLine,
        csvSecondLine,
        csvThirdLine,
      ];

      expect(
        await exportToCsv({
          aliases,
          comments,
          elementsToDelete: [],
          filesAndFolders,
          filesAndFoldersMetadata,
          hashes,
          tags,
          translator,
        })
          .pipe(toArray())
          .toPromise()
          .then(flatten)
      ).toEqual(expectedCsv);
    });

    it("should handle elementsToDelete", async () => {
      const csvHeader = [
        "",
        "translate(csvHeader.path)",
        "translate(csvHeader.pathLength)",
        "translate(csvHeader.name)",
        "translate(csvHeader.extension)",
        "translate(csvHeader.size)",
        "translate(csvHeader.firstModified)",
        "translate(csvHeader.lastModified)",
        "translate(csvHeader.newFirstModified)",
        "translate(csvHeader.newLastModified)",
        "translate(csvHeader.newPath)",
        "translate(csvHeader.newName)",
        "translate(csvHeader.description)",
        "translate(csvHeader.fileOrFolder)",
        "translate(csvHeader.depth)",
        "translate(csvHeader.fileCount)",
        "translate(csvHeader.type)",
        "translate(csvHeader.hash)",
        "translate(csvHeader.duplicate)",
        "translate(csvHeader.toDelete)",
        `tag0 : ${tag2Name}`,
        `tag1 : ${tagName}`,
      ];
      const csvFirstLine = [
        "",
        `${formatPathForUserSystem(rootFolderId)}`,
        "5",
        "root",
        "",
        "10000",
        "01/01/1970",
        "01/01/1970",
        "",
        "",
        "",
        "",
        "",
        translator("common.folder"),
        "0",
        "1",
        translator("common.folder"),
        rootFolderHash,
        translator("common.no"),
        "",
        "",
        "",
      ];
      const csvSecondLine = [
        "",
        `${formatPathForUserSystem(taggedFfId)}`,
        "12",
        "folder",
        "",
        "10000",
        "01/01/1970",
        "01/01/1970",
        "",
        "",
        "",
        "",
        "",
        translator("common.folder"),
        "1",
        "1",
        translator("common.folder"),
        taggedHash,
        translator("common.yes"),
        "",
        `${tag2Name}`,
        `${tagName}`,
      ];
      const csvThirdLine = [
        "",
        `${formatPathForUserSystem(firstChildId)}`,
        "22",
        "ff-id.txt",
        ".txt",
        "10000",
        "01/01/1970",
        "01/01/1970",
        "",
        "",
        `${formatPathForUserSystem(firstChildVirtualPath)}`,
        `${aliases[firstChildId]}`,
        `${comments[firstChildId]}`,
        translator("common.file"),
        "2",
        "1",
        "plain",
        firstChildIdHash,
        translator("common.yes"),
        translator("common.toDelete"),
        `${tag2Name}`,
        `${tagName}`,
      ];
      const expectedCsv = [
        csvHeader,
        csvFirstLine,
        csvSecondLine,
        csvThirdLine,
      ];

      expect(
        await exportToCsv({
          aliases,
          comments,
          elementsToDelete: ["/root/folder/ff-id.txt"],
          filesAndFolders,
          filesAndFoldersMetadata,
          hashes,
          tags,
          translator,
        })
          .pipe(toArray())
          .toPromise()
          .then(flatten)
      ).toEqual(expectedCsv);
    });
  });
});
