import _ from "lodash";
import { createEmptyStore, wrapStoreWithUndoable } from "../store-test-utils";
import {
  getFilesAndFoldersAverageLastModified,
  getFilesAndFoldersDepth,
  getFilesAndFoldersFromStore,
  getFilesAndFoldersMaxLastModified,
  getFilesAndFoldersMedianLastModified,
  getFilesAndFoldersMinLastModified,
  getFilesAndFoldersTotalSize,
  getHashesFromStore
} from "./files-and-folders-selectors";
import { createFilesAndFolders } from "./files-and-folders-test-utils";

/**
 * Returns a timestamp from date string
 * @param date - A valid date string to be parsed by Date
 */
const getTimestampFromStringDate = (date: string): number =>
  new Date(date).getTime();

const maxLastModified = getTimestampFromStringDate("10/10/2019");
const medianLastModified = getTimestampFromStringDate("10/10/2010");
const minLastModified = getTimestampFromStringDate("10/10/1996");
const rootFolderId = "/rootFolder";
const child1Id = `${rootFolderId}/folder1`;
const child2Id = `/${rootFolderId}/file1`;
const child11Id = `${child1Id}/file1`;
const child12Id = `${child1Id}/file2`;
const filesAndFoldersTestMap = {
  "/rootFolder": createFilesAndFolders({
    children: [child1Id, child2Id],
    id: "/rootFolder"
  }),
  [child1Id]: createFilesAndFolders({
    children: [child11Id, child12Id],
    id: child1Id
  }),
  [child11Id]: createFilesAndFolders({
    file_last_modified: minLastModified,
    file_size: 10,
    id: child11Id
  }),
  [child12Id]: createFilesAndFolders({
    file_last_modified: maxLastModified,
    file_size: 100,
    id: child11Id
  }),
  [child2Id]: createFilesAndFolders({
    file_last_modified: medianLastModified,
    file_size: 1000,
    id: child2Id
  })
};

describe("files-and-folders-selectors", () => {
  describe("getFilesAndFoldersFromStore", () => {
    it("should return the current store", () => {
      const fileId = "base-id";
      const filesAndFolders1 = createFilesAndFolders({ id: fileId });
      const emptyStore = createEmptyStore();
      const filesAndFoldersMap = {
        [fileId]: filesAndFolders1
      };
      const testStore = {
        ...emptyStore,
        filesAndFolders: wrapStoreWithUndoable({
          filesAndFolders: filesAndFoldersMap,
          hashes: {}
        })
      };
      expect(getFilesAndFoldersFromStore(testStore)).toEqual(
        filesAndFoldersMap
      );
    });
  });

  describe("getFilesAndFoldersMaxLastModified", () => {
    it("should find the maximum last modified date amongst the children of the root folder", () => {
      expect(
        getFilesAndFoldersMaxLastModified(filesAndFoldersTestMap, rootFolderId)
      ).toEqual(maxLastModified);
    });
  });

  describe("getFilesAndFoldersMinLastModified", () => {
    it("should find the maximum last modified date amongst the children of the root folder", () => {
      expect(
        getFilesAndFoldersMinLastModified(filesAndFoldersTestMap, rootFolderId)
      ).toEqual(minLastModified);
    });
  });

  describe("getFilesAndFoldersAverageLastModified", () => {
    it("should find the maximum last modified date amongst the children of the root folder", () => {
      const average = _.mean([
        minLastModified,
        medianLastModified,
        maxLastModified
      ]);
      expect(
        getFilesAndFoldersAverageLastModified(
          filesAndFoldersTestMap,
          rootFolderId
        )
      ).toEqual(average);
    });
  });

  describe("getFilesAndFoldersMedianLastModified", () => {
    it("should find the maximum last modified date amongst the children of the root folder", () => {
      expect(
        getFilesAndFoldersMedianLastModified(
          filesAndFoldersTestMap,
          rootFolderId
        )
      ).toEqual(medianLastModified);
    });
  });

  describe("getFilesAndFoldersTotalSize", () => {
    it("should find the maximum last modified date amongst the children of the root folder", () => {
      expect(
        getFilesAndFoldersTotalSize(filesAndFoldersTestMap, rootFolderId)
      ).toEqual(1110);
    });
  });

  describe("getFilesAndFoldersDepth", () => {
    it("should find the depth root folder", () => {
      expect(getFilesAndFoldersDepth(child1Id)).toEqual(1);
    });
  });

  describe("getHashesFromStore", () => {
    it("should return the current store", () => {
      const fileId = "base-id";
      const hash = "hash";
      const emptyStore = createEmptyStore();
      const hashesMap = {
        [fileId]: hash
      };
      const testStore = {
        ...emptyStore,
        filesAndFolders: wrapStoreWithUndoable({
          filesAndFolders: {},
          hashes: hashesMap
        })
      };
      expect(getHashesFromStore(testStore)).toEqual(hashesMap);
    });
  });
});
