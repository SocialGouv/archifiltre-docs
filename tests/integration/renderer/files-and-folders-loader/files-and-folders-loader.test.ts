import {
  createFilesAndFoldersMetadataDataStructure,
  loadFileSystemFromFilesAndFoldersLoader,
} from "@renderer/files-and-folders-loader/file-system-loading-process-utils";
import type { FilesElementInfo } from "@renderer/files-and-folders-loader/files-and-folders-loader";
import {
  asyncLoadFilesAndFoldersFromFileSystem,
  createFilesAndFoldersDataStructure,
  loadFilesAndFoldersFromExportFileContent,
} from "@renderer/files-and-folders-loader/files-and-folders-loader";
import { createFilesAndFoldersMetadata } from "@renderer/reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
// @ts-expect-error Mock
import { setMockFs as hiddenFileSetMockFs } from "@renderer/utils/hidden-file/hidden-file-util";
import { version } from "@renderer/version";
import fs from "fs";
import { sortBy } from "lodash";
import { Readable } from "stream";

import { createFilesAndFolders } from "../reducers/files-and-folders/files-and-folders-test-utils";

interface FsMockElement {
  isDirectory: boolean;
  children: string[];
  mtimeMs: number;
  size: number;
  isHidden: boolean;
}

type FsMockElementMap = Record<string, FsMockElement>;

jest.mock("fs", () => {
  let underlyingFs: FsMockElementMap = {};

  const setMockFs = (mockedFs: FsMockElementMap): void => {
    underlyingFs = mockedFs;
  };

  const makeStatObject = (fsMockElement: FsMockElement) => ({
    isDirectory: () => fsMockElement.isDirectory,
    mtimeMs: fsMockElement.mtimeMs,
    size: fsMockElement.size,
  });

  const module = {
    promises: {
      readdir: async (path: string) =>
        Promise.resolve(underlyingFs[path].children),
      stat: async (path: string) =>
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        underlyingFs[path]
          ? Promise.resolve(makeStatObject(underlyingFs[path]!))
          : Promise.reject(),
    },
    readdirSync: (path: string) => {
      return underlyingFs[path].children;
    },
    setMockFs,
    statSync: (path: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!underlyingFs[path]) {
        throw new Error();
      }
      return makeStatObject(underlyingFs[path]!);
    },
  };

  return {
    __esModule: true,
    ...module,
    default: module,
  };
});

jest.mock("@renderer/util/hidden-file/hidden-file-util", () => {
  let underlyingFs: FsMockElementMap = {};
  const setMockFs = (mockedFs: FsMockElementMap): void => {
    underlyingFs = mockedFs;
  };

  const module = {
    asyncShouldIgnoreElement: async (elementPath: string) =>
      Promise.resolve(!!underlyingFs[elementPath].isHidden),
    setMockFs,
    shouldIgnoreElement: (elementPath: string) =>
      !!underlyingFs[elementPath].isHidden,
  };

  return {
    __esModule: true,
    ...module,
    default: module,
  };
});

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
const origin: FilesElementInfo[] = [
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
  "": createFilesAndFoldersMetadata({
    averageLastModified: 44000,
    childrenTotalSize: 17345,
    maxLastModified: 100000,
    medianLastModified: 30000,
    minLastModified: 2000,
    nbChildrenFiles: 3,
    sortAlphaNumericallyIndex: [0],
    sortByDateIndex: [0],
    sortBySizeIndex: [0],
  }),
  "/root": createFilesAndFoldersMetadata({
    averageLastModified: 44000,
    childrenTotalSize: 17345,
    maxLastModified: 100000,
    medianLastModified: 30000,
    minLastModified: 2000,
    nbChildrenFiles: 3,
    sortAlphaNumericallyIndex: [0, 1],
    sortByDateIndex: [1, 0],
    sortBySizeIndex: [0, 1],
  }),
  "/root/folder": createFilesAndFoldersMetadata({
    averageLastModified: 51000,
    childrenTotalSize: 14345,
    maxLastModified: 100000,
    medianLastModified: 51000,
    minLastModified: 2000,
    nbChildrenFiles: 2,
    sortAlphaNumericallyIndex: [0, 1],
    sortByDateIndex: [1, 0],
    sortBySizeIndex: [0, 1],
  }),
  "/root/folder/bob": createFilesAndFoldersMetadata({
    averageLastModified: 100000,
    childrenTotalSize: 12345,
    maxLastModified: 100000,
    medianLastModified: 100000,
    minLastModified: 100000,
    nbChildrenFiles: 1,
    sortAlphaNumericallyIndex: [],
    sortByDateIndex: [],
    sortBySizeIndex: [],
  }),
  "/root/folder/michael": createFilesAndFoldersMetadata({
    averageLastModified: 2000,
    childrenTotalSize: 2000,
    maxLastModified: 2000,
    medianLastModified: 2000,
    minLastModified: 2000,
    nbChildrenFiles: 1,
    sortAlphaNumericallyIndex: [],
    sortByDateIndex: [],
    sortBySizeIndex: [],
  }),
  "/root/johnny": createFilesAndFoldersMetadata({
    averageLastModified: 30000,
    childrenTotalSize: 3000,
    maxLastModified: 30000,
    medianLastModified: 30000,
    minLastModified: 30000,
    nbChildrenFiles: 1,
    sortAlphaNumericallyIndex: [],
    sortByDateIndex: [],
    sortBySizeIndex: [],
  }),
};

const rootPath = "/root-path";

const mockFs: FsMockElementMap = {
  "/root-path": {
    children: ["folder1", "file1"],
    isDirectory: true,
    isHidden: false,
    mtimeMs: 0,
    size: 0,
  },
  "/root-path/file1": {
    children: [],
    isDirectory: false,
    isHidden: false,
    mtimeMs: 10,
    size: 10,
  },
  "/root-path/folder1": {
    children: ["file1", "file2"],
    isDirectory: true,
    isHidden: false,
    mtimeMs: 0,
    size: 0,
  },
  "/root-path/folder1/file1": {
    children: [],
    isDirectory: false,
    isHidden: false,
    mtimeMs: 20,
    size: 20,
  },
  "/root-path/folder1/file2": {
    children: [],
    isDirectory: false,
    isHidden: false,
    mtimeMs: 30,
    size: 30,
  },
};

describe("files-and-folders-loader", () => {
  describe("loadFromFilesystem", () => {
    beforeEach(() => {
      // @ts-expect-error Mock
      fs.setMockFs(mockFs);
      hiddenFileSetMockFs(mockFs);
    });
    const sortMethod = (
      element: {
        lastModified: number;
        size: number;
      }[]
    ) => element[1];
    const expectedOrigin = sortBy(
      [
        [
          {
            lastModified: 10,
            size: 10,
          },
          `${rootPath}/file1`,
        ],
        [
          {
            lastModified: 20,
            size: 20,
          },
          `${rootPath}/folder1/file1`,
        ],
        [
          {
            lastModified: 30,
            size: 30,
          },
          `${rootPath}/folder1/file2`,
        ],
      ],
      sortMethod
    );

    describe("async", () => {
      it("should load the right origins", async () => {
        const resultOrigin = await asyncLoadFilesAndFoldersFromFileSystem(
          rootPath
        );

        expect(sortBy(resultOrigin, sortMethod)).toEqual(expectedOrigin);
      });
    });
  });

  describe("loadFilesAndFoldersFromExportFileContent", () => {
    it("should read a linux generated file", async () => {
      const exportFileContent = `1.0.0
unix
/basePath/files
"/basePath/files/file.txt",1584108263,5,d8e8fca2dc0f896fd7cb4cb0031ba249
"/basePath/files/file",1563979128,49,0052aa96e1e52f1a0d6489731155dce3
"/basePath/files/file2",1582727849,8196,87706eb5706972ee4134891ca9cb6708
"/basePath/files/folder/file with space",1563979128,49,0052aa96e1e52f1a0d6489731155dce3
`;
      const stream = Readable.from(exportFileContent);

      const loadedData = await loadFilesAndFoldersFromExportFileContent(stream);

      expect(loadedData).toEqual({
        files: [
          [
            {
              lastModified: 1584108263000,
              size: 5,
            },
            "/files/file.txt",
          ],
          [
            {
              lastModified: 1563979128000,
              size: 49,
            },
            "/files/file",
          ],
          [
            {
              lastModified: 1582727849000,
              size: 8196,
            },
            "/files/file2",
          ],
          [
            {
              lastModified: 1563979128000,
              size: 49,
            },
            "/files/folder/file with space",
          ],
        ],
        hashes: {
          "/files/file": "0052aa96e1e52f1a0d6489731155dce3",
          "/files/file.txt": "d8e8fca2dc0f896fd7cb4cb0031ba249",
          "/files/file2": "87706eb5706972ee4134891ca9cb6708",
          "/files/folder/file with space": "0052aa96e1e52f1a0d6489731155dce3",
        },
        rootPath: "/basePath/files",
      });
    });

    it("should read a 1.0.0 windows generated file", async () => {
      const exportFileContent = `1.0.0\r
windows\r
C:\\basePath\\files\r
"C:\\basePath\\files\\file.txt",5,1584108263,0000,d8e8fca2dc0f896fd7cb4cb0031ba249\r
"C:\\basePath\\files\\file",49,1563979128,0000,0052aa96e1e52f1a0d6489731155dce3\r
"C:\\basePath\\files\\file2",8196,1582727849,0000,87706eb5706972ee4134891ca9cb6708\r
"C:\\basePath\\files\\folder\\file with space",49,1563979128,0000,0052aa96e1e52f1a0d6489731155dce3\r
`;

      const stream = Readable.from(exportFileContent);

      const loadedData = await loadFilesAndFoldersFromExportFileContent(stream);

      expect(loadedData).toEqual({
        files: [
          [
            {
              lastModified: 1584108263000,
              size: 5,
            },
            "/files/file.txt",
          ],
          [
            {
              lastModified: 1563979128000,
              size: 49,
            },
            "/files/file",
          ],
          [
            {
              lastModified: 1582727849000,
              size: 8196,
            },
            "/files/file2",
          ],
          [
            {
              lastModified: 1563979128000,
              size: 49,
            },
            "/files/folder/file with space",
          ],
        ],
        hashes: {
          "/files/file": "0052aa96e1e52f1a0d6489731155dce3",
          "/files/file.txt": "d8e8fca2dc0f896fd7cb4cb0031ba249",
          "/files/file2": "87706eb5706972ee4134891ca9cb6708",
          "/files/folder/file with space": "0052aa96e1e52f1a0d6489731155dce3",
        },
        rootPath: "C:\\basePath\\files",
      });
    });

    it("should read a 1.0.1 windows generated file", async () => {
      const exportFileContent = `1.0.1\r
windows\r
C:\\basePath\\files\r
"C:\\basePath\\files\\file.txt",5,"1584108263,0000",d8e8fca2dc0f896fd7cb4cb0031ba249\r
"C:\\basePath\\files\\file",49,"1563979128,0000",0052aa96e1e52f1a0d6489731155dce3\r
"C:\\basePath\\files\\file2",8196,"1582727849,0000",87706eb5706972ee4134891ca9cb6708\r
"C:\\basePath\\files\\folder\\file with space",49,"1563979128,0000",0052aa96e1e52f1a0d6489731155dce3\r
`;

      const stream = Readable.from(exportFileContent);

      const loadedData = await loadFilesAndFoldersFromExportFileContent(stream);

      expect(loadedData).toEqual({
        files: [
          [
            {
              lastModified: 1584108263000,
              size: 5,
            },
            "/files/file.txt",
          ],
          [
            {
              lastModified: 1563979128000,
              size: 49,
            },
            "/files/file",
          ],
          [
            {
              lastModified: 1582727849000,
              size: 8196,
            },
            "/files/file2",
          ],
          [
            {
              lastModified: 1563979128000,
              size: 49,
            },
            "/files/folder/file with space",
          ],
        ],
        hashes: {
          "/files/file": "0052aa96e1e52f1a0d6489731155dce3",
          "/files/file.txt": "d8e8fca2dc0f896fd7cb4cb0031ba249",
          "/files/file2": "87706eb5706972ee4134891ca9cb6708",
          "/files/folder/file with space": "0052aa96e1e52f1a0d6489731155dce3",
        },
        rootPath: "C:\\basePath\\files",
      });
    });
  });

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

    it("shoud handle overrides", () => {
      const overrideLastModified = 40000;
      const lastModified = {
        [ff1Path]: overrideLastModified,
      };
      expect(
        createFilesAndFoldersMetadataDataStructure(
          expectedFilesAndFolders,
          {},
          {
            lastModified,
          }
        )
      ).toEqual({
        ...expectedMetadata,
        "": {
          ...expectedMetadata[""],
          averageLastModified: 24000,
          maxLastModified: 40000,
        },
        "/root": {
          ...expectedMetadata["/root"],
          averageLastModified: 24000,
          maxLastModified: 40000,
          sortByDateIndex: [0, 1],
        },
        "/root/folder": {
          ...expectedMetadata["/root/folder"],
          averageLastModified: 21000,
          maxLastModified: 40000,
          medianLastModified: 21000,
        },
        [ff1Path]: {
          ...expectedMetadata[ff1Path],
          averageLastModified: 40000,
          maxLastModified: 40000,
          medianLastModified: 40000,
          minLastModified: 40000,
        },
      });
    });
  });

  describe("loadFileSystemFromFilesAndFoldersLoader", () => {
    it("should prefill unset fields", async () => {
      const loadFilesAndFolders = () => ({
        filesAndFolders: expectedFilesAndFolders,
        originalPath: "/basePath",
      });

      const virtualFileSystem = await loadFileSystemFromFilesAndFoldersLoader(
        loadFilesAndFolders
      );

      expect(virtualFileSystem).toEqual({
        aliases: {},
        comments: {},
        elementsToDelete: [],
        filesAndFolders: expectedFilesAndFolders,
        filesAndFoldersMetadata: expectedMetadata,
        hashes: {},
        isOnFileSystem: false,
        originalPath: "/basePath",
        overrideLastModified: {},
        sessionName: "",
        tags: {},
        version,
        virtualPathToIdMap: {},
      });
    });
  });
});
