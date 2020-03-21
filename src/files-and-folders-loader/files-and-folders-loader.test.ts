import {
  createFilesAndFolders,
  createFilesAndFoldersDataStructure,
  createFilesAndFoldersMetadataDataStructure,
  FilesAndFoldersElementInfo,
} from "./files-and-folders-loader";

const ff1LastModified = 100000;
const ff1Size = 12345;
const ff1Path = "/root/folder/bob";
const ff1 = {
  lastModified: ff1LastModified,
  size: ff1Size,
};
const ff2LastModified = 2000;
const ff2Size = 2000;
const ff2Path = "/root/folder/michael";
const ff2 = {
  lastModified: ff2LastModified,
  size: ff2Size,
};
const ff3LastModified = 30000;
const ff3Size = 3000;
const ff3Path = "/root/johnny";
const ff3 = {
  lastModified: ff3LastModified,
  size: ff3Size,
};
const origin: FilesAndFoldersElementInfo[] = [
  [ff1, ff1Path],
  [ff2, ff2Path],
  [ff3, ff3Path],
];

const expectedFilesAndFolders = {
  "": createFilesAndFolders({
    children: ["/root"],
    id: "",
  }),
  "/root": createFilesAndFolders({
    children: ["/root/folder", "/root/johnny"],
    id: "/root",
  }),
  "/root/folder": createFilesAndFolders({
    children: [ff1Path, ff2Path],
    id: "/root/folder",
  }),
  [ff1Path]: createFilesAndFolders({
    file_last_modified: ff1LastModified,
    file_size: ff1Size,
    id: ff1Path,
  }),
  [ff2Path]: createFilesAndFolders({
    file_last_modified: ff2LastModified,
    file_size: ff2Size,
    id: ff2Path,
  }),
  [ff3Path]: createFilesAndFolders({
    file_last_modified: ff3LastModified,
    file_size: ff3Size,
    id: ff3Path,
  }),
};

const expectedMetadata = {
  "": {
    averageLastModified: 44000,
    childrenTotalSize: 17345,
    maxLastModified: 100000,
    medianLastModified: 30000,
    minLastModified: 2000,
    nbChildrenFiles: 3,
    sortByDateIndex: [0],
    sortBySizeIndex: [0],
  },
  "/root": {
    averageLastModified: 44000,
    childrenTotalSize: 17345,
    maxLastModified: 100000,
    medianLastModified: 30000,
    minLastModified: 2000,
    nbChildrenFiles: 3,
    sortByDateIndex: [1, 0],
    sortBySizeIndex: [0, 1],
  },
  "/root/folder": {
    averageLastModified: 51000,
    childrenTotalSize: 14345,
    maxLastModified: 100000,
    medianLastModified: 51000,
    minLastModified: 2000,
    nbChildrenFiles: 2,
    sortByDateIndex: [1, 0],
    sortBySizeIndex: [0, 1],
  },
  "/root/folder/bob": {
    averageLastModified: 100000,
    childrenTotalSize: 12345,
    maxLastModified: 100000,
    medianLastModified: 100000,
    minLastModified: 100000,
    nbChildrenFiles: 1,
    sortByDateIndex: [],
    sortBySizeIndex: [],
  },
  "/root/folder/michael": {
    averageLastModified: 2000,
    childrenTotalSize: 2000,
    maxLastModified: 2000,
    medianLastModified: 2000,
    minLastModified: 2000,
    nbChildrenFiles: 1,
    sortByDateIndex: [],
    sortBySizeIndex: [],
  },
  "/root/johnny": {
    averageLastModified: 30000,
    childrenTotalSize: 3000,
    maxLastModified: 30000,
    medianLastModified: 30000,
    minLastModified: 30000,
    nbChildrenFiles: 1,
    sortByDateIndex: [],
    sortBySizeIndex: [],
  },
};

describe("files-and-folders-loader", () => {
  describe("createFilesAndFoldersDataStructure", () => {
    it("should return the right structure", () => {
      expect(createFilesAndFoldersDataStructure(origin)).toEqual(
        expectedFilesAndFolders
      );
    });
  });

  describe("createFilesAndFoldersMetadataDataStructure", () => {
    it("should return the right metadata", () => {
      expect(
        createFilesAndFoldersMetadataDataStructure(expectedFilesAndFolders)
      ).toEqual(expectedMetadata);
    });
  });
});
