import _ from "lodash";
import { createEmptyStore, wrapStoreWithUndoable } from "../store-test-utils";
import { initialState as filesAndFoldersInitialState } from "./files-and-folders-reducer";
import {
  decomposePathToElement,
  findElementParent,
  getFileCount,
  getFiles,
  getFilesAndFoldersAverageLastModified,
  getFilesAndFoldersDepth,
  getFilesAndFoldersFromStore,
  getFilesAndFoldersMaxLastModified,
  getFilesAndFoldersMedianLastModified,
  getFilesAndFoldersMinLastModified,
  getFilesAndFoldersTotalSize,
  getFilesMap,
  getFolders,
  getFoldersCount,
  getHashesFromStore,
  getMaxDepth,
  isFile
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
const rootFolder = createFilesAndFolders({
  children: [child1Id, child2Id],
  id: rootFolderId
});
const child1 = createFilesAndFolders({
  children: [child11Id, child12Id],
  id: child1Id
});
const child11 = createFilesAndFolders({
  file_last_modified: minLastModified,
  file_size: 10,
  id: child11Id
});
const child12 = createFilesAndFolders({
  file_last_modified: maxLastModified,
  file_size: 100,
  id: child11Id
});

const child2 = createFilesAndFolders({
  file_last_modified: medianLastModified,
  file_size: 1000,
  id: child2Id
});

const filesAndFoldersTestMap = {
  [rootFolderId]: rootFolder,
  [child1Id]: child1,
  [child11Id]: child11,
  [child12Id]: child12,
  [child2Id]: child2
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
          ...filesAndFoldersInitialState,
          filesAndFolders: filesAndFoldersMap
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

  describe("getFiles", () => {
    it("should filter out the folders", () => {
      const files = getFiles(filesAndFoldersTestMap);
      expect(files.length).toBe(3);
      expect(files).toEqual(expect.arrayContaining([child12, child11, child2]));
    });
  });

  describe("getFilesMap", () => {
    it("should filter out the folders", () => {
      const filesMap = getFilesMap(filesAndFoldersTestMap);
      expect(filesMap).toEqual({
        [child2Id]: child2,
        [child11Id]: child11,
        [child12Id]: child12
      });
    });
  });

  describe("getFolders", () => {
    it("should filter out files", () => {
      const folders = getFolders(filesAndFoldersTestMap);
      expect(folders.length).toBe(2);
      expect(folders).toEqual(expect.arrayContaining([rootFolder, child1]));
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
          ...filesAndFoldersInitialState,
          hashes: hashesMap
        })
      };
      expect(getHashesFromStore(testStore)).toEqual(hashesMap);
    });
  });

  describe("isFile", () => {
    it("should return true if the element is a file", () => {
      const filesAndFolders = createFilesAndFolders({
        children: [],
        id: "test"
      });

      expect(isFile(filesAndFolders)).toBe(true);
    });

    it("should return false if the element is a folder", () => {
      const filesAndFolders = createFilesAndFolders({
        children: ["child1"],
        id: "test"
      });

      expect(isFile(filesAndFolders)).toBe(false);
    });
  });

  describe("getFileCount", () => {
    it("should return the right number of files", () => {
      const fileId = "/folder/file";
      const folderId = "/folder";

      const filesAndFoldersMap = {
        [fileId]: createFilesAndFolders({ id: fileId, children: [] }),
        [folderId]: createFilesAndFolders({ id: folderId, children: [fileId] })
      };

      expect(getFileCount(filesAndFoldersMap)).toBe(1);
    });
  });

  describe("getFoldersCount", () => {
    it("should return the right number of files", () => {
      const fileId = "/folder/file";
      const folderId = "/folder";

      const filesAndFoldersMap = {
        [fileId]: createFilesAndFolders({ id: fileId, children: [] }),
        [folderId]: createFilesAndFolders({ id: folderId, children: [fileId] })
      };

      expect(getFoldersCount(filesAndFoldersMap)).toBe(1);
    });
  });

  describe("getMaxDepth", () => {
    it("should compute the max depth", () => {
      const folderId = "root-folder";
      const subfolderId = "root-folder/subfolderId";
      const deepestFileId = "root-folder/subfolderId/subfile";
      const otherFileId = "rootFolder/subfileId";

      const filesAndFoldersMap = {
        "": createFilesAndFolders({ id: "", children: [folderId] }),
        [folderId]: createFilesAndFolders({
          children: [otherFileId, subfolderId],
          id: folderId
        }),
        [subfolderId]: createFilesAndFolders({
          children: [deepestFileId],
          id: subfolderId
        }),
        [otherFileId]: createFilesAndFolders({ id: otherFileId }),
        [deepestFileId]: createFilesAndFolders({ id: deepestFileId })
      };

      expect(getMaxDepth(filesAndFoldersMap)).toBe(3);
    });
  });

  describe("decomposePathToElement", () => {
    it("should return the decomposed path to the element", () => {
      const path = "/f1/f2/f3/file";

      expect(decomposePathToElement(path)).toEqual([
        "",
        "/f1",
        "/f1/f2",
        "/f1/f2/f3",
        "/f1/f2/f3/file"
      ]);
    });
  });

  describe("findElementParent", () => {
    it("should return the element parent", () => {
      expect(findElementParent(child12Id, filesAndFoldersTestMap)).toEqual(
        child1
      );
    });
  });
});
