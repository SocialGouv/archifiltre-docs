import { createFilesAndFoldersMetadata } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-test-utils";
import { createAsyncWorkerMock } from "../../util/async-worker-test-utils";
import { MessageTypes } from "../../util/batch-process/batch-process-util-types";
import { onInitialize } from "./csv-exporter.impl";

const tagName = "test-tag-1";
const rootFolderId = "/root";
const taggedFfId = "/root/folder";
const firstChildId = "/root/folder/ff-id.txt";
const tagId = "test-tag-id";
const tagId2 = "test-tag-id-2";
const rootId = "";
const tag2Name = "tag2";
const alias = "test-alias";
const comments = "test-comments";
const tags = {
  [tagId]: {
    ffIds: [taggedFfId],
    id: tagId,
    name: tagName
  },
  [tagId2]: {
    ffIds: [taggedFfId],
    id: tagId2,
    name: tag2Name
  }
};

const filesAndFolders = {
  [rootId]: {
    alias: "",
    children: [rootFolderId],
    comments: "",
    file_last_modified: 1571325669,
    file_size: 10,
    hash: null,
    id: rootId,
    name: ""
  },
  [rootFolderId]: {
    alias: "",
    children: [taggedFfId],
    comments: "",
    file_last_modified: 1571325669,
    file_size: 10,
    hash: null,
    id: rootId,
    name: "root"
  },
  [taggedFfId]: {
    alias: "",
    children: [firstChildId],
    comments: "",
    file_last_modified: 1571325669,
    file_size: 10,
    hash: null,
    id: taggedFfId,
    name: "folder"
  },
  [firstChildId]: {
    alias,
    children: [],
    comments,
    file_last_modified: 1571325669,
    file_size: 10,
    hash: null,
    id: taggedFfId,
    name: "ff-id.txt"
  }
};

const filesAndFoldersMetadata = {
  [rootFolderId]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 10000,
    medianLastModified: 4000,
    minLastModified: 1000
  }),
  [taggedFfId]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 10000,
    medianLastModified: 4000,
    minLastModified: 1000
  }),
  [firstChildId]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 10000,
    medianLastModified: 4000,
    minLastModified: 1000
  })
};

const rootHash = "root-tag";
const rootFolderHash = "root-folder-hash";
const taggedHash = "tagged-hash";
const firstChildIdHash = "tagged-hash";
const hashes = {
  [rootId]: rootHash,
  [rootFolderId]: rootFolderHash,
  [taggedFfId]: taggedHash,
  [firstChildId]: firstChildIdHash
};

const getResultCall = calls => calls[calls.length - 2];
const getCompleteCall = calls => calls[calls.length - 1];

describe("csv-exporter.impl", () => {
  describe("onInitialize", () => {
    it("should return the right csv without hashes", async () => {
      const asyncWorker = createAsyncWorkerMock();
      const csvHeader = `"";"path";"path length";"name";"extension";"size (octet)";"last_modified";"new name";"description";"file/folder";"depth";"tag0 : ${tag2Name}";"tag1 : ${tagName}"`;
      const csvFirstLine = `"";"/root";"5";"root";"";"10000";"01/01/1970";"";"";"folder";"0";"";""`;
      const csvSecondLine = `"";"/root/folder";"12";"folder";"";"10000";"01/01/1970";"";"";"folder";"1";"${tag2Name}";"${tagName}"`;
      const csvThirdLine = `"";"/root/folder/ff-id.txt";"22";"ff-id.txt";".txt";"10000";"01/01/1970";"${alias}";"${comments}";"file";"2";"${tag2Name}";"${tagName}"`;
      const expectedCsv = [
        csvHeader,
        csvFirstLine,
        csvSecondLine,
        csvThirdLine
      ].join("\n");

      await onInitialize(asyncWorker, {
        filesAndFolders,
        filesAndFoldersMetadata,
        language: "en",
        tags
      });

      const calls = asyncWorker.postMessage.mock.calls;

      expect(calls.length).toBe(5);

      expect(getResultCall(calls)).toEqual([
        {
          result: expectedCsv,
          type: MessageTypes.RESULT
        }
      ]);

      expect(getCompleteCall(calls)).toEqual([
        {
          type: MessageTypes.COMPLETE
        }
      ]);
    });

    it("should return the right csv with hashes", async () => {
      const asyncWorker = createAsyncWorkerMock();
      const csvHeader = `"";"path";"path length";"name";"extension";"size (octet)";"last_modified";"new name";"description";"file/folder";"depth";"hash (MD5)";"tag0 : ${tag2Name}";"tag1 : ${tagName}"`;
      const csvFirstLine = `"";"/root";"5";"root";"";"10000";"01/01/1970";"";"";"folder";"0";"${rootFolderHash}";"";""`;
      const csvSecondLine = `"";"/root/folder";"12";"folder";"";"10000";"01/01/1970";"";"";"folder";"1";"${taggedHash}";"${tag2Name}";"${tagName}"`;
      const csvThirdLine = `"";"/root/folder/ff-id.txt";"22";"ff-id.txt";".txt";"10000";"01/01/1970";"${alias}";"${comments}";"file";"2";"${firstChildIdHash}";"${tag2Name}";"${tagName}"`;
      const expectedCsv = [
        csvHeader,
        csvFirstLine,
        csvSecondLine,
        csvThirdLine
      ].join("\n");

      await onInitialize(asyncWorker, {
        filesAndFolders,
        filesAndFoldersMetadata,
        hashes,
        language: "en",
        tags
      });

      const calls = asyncWorker.postMessage.mock.calls;

      expect(calls.length).toBe(5);

      expect(getResultCall(calls)).toEqual([
        {
          result: expectedCsv,
          type: MessageTypes.RESULT
        }
      ]);

      expect(getCompleteCall(calls)).toEqual([
        {
          type: MessageTypes.COMPLETE
        }
      ]);
    });
  });
});
