import {
  getFiles,
  getFolders,
} from "@renderer/reducers/files-and-folders/files-and-folders-selectors";
import type { FilesAndFolders } from "@renderer/reducers/files-and-folders/files-and-folders-types";
import {
  computeFolderHashes,
  countDeeperFolders,
  countFoldersWithMoreThanNChildren,
  countLongerPath,
  createFilePathSequence,
  filesAndFoldersMapToArray,
  findAllFoldersWithNoSubfolder,
  getAllChildren,
  getFirstLevelName,
  getType,
  isExactFileOrAncestor,
  removeChildrenPath,
  sortFoldersByChildrenCount,
  sortFoldersByDepth,
} from "@renderer/utils/file-and-folders";
import MD5 from "js-md5";

import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";

describe.skip("file-and-folders-common", () => {
  describe("countFoldersWithMoreThanNChildren", () => {
    describe("with an empty array", () => {
      it("should return 0", () => {
        expect(countFoldersWithMoreThanNChildren(2)([])).toEqual(0);
      });
    });

    describe("with a one element array with an equal number of children", () => {
      it("should return 0", () => {
        const folderList = [
          {
            children: ["id1", "id2"],
          },
        ];
        expect(
          countFoldersWithMoreThanNChildren(2)(folderList as FilesAndFolders[])
        ).toEqual(0);
      });
    });

    describe("with a one element array with a superior number of children", () => {
      it("should return 1", () => {
        const folderList = [
          {
            children: ["id1", "id2", "id3"],
          },
        ];
        expect(
          countFoldersWithMoreThanNChildren(2)(folderList as FilesAndFolders[])
        ).toEqual(1);
      });
    });
    describe("with a multiple elements array", () => {
      it("should return the right count", () => {
        const folderList = [
          {
            children: ["id1", "id2", "id3"],
          },
          {
            children: ["id1", "id2"],
          },
          {
            children: ["id3"],
          },
          {
            children: ["id1", "id2", "id3"],
          },
          {
            children: ["id1", "id2", "id3"],
          },
        ];
        expect(
          countFoldersWithMoreThanNChildren(2)(folderList as FilesAndFolders[])
        ).toEqual(3);
      });
    });
  });

  describe("countDeeperFolders", () => {
    describe("with an empty array", () => {
      it("should return 0", () => {
        expect(countDeeperFolders(2)([])).toEqual(0);
      });
    });

    describe("with a multiple elements array", () => {
      it("should return the right count", () => {
        const folderList = [
          {
            depth: 1,
          },
          {
            depth: 2,
          },
          {
            depth: 3,
          },
          {
            depth: 1,
          },
          {
            depth: 3,
          },
        ];
        expect(countDeeperFolders(2)(folderList as FilesAndFolders[])).toEqual(
          2
        );
      });
    });
  });

  describe("countLongerPath", () => {
    describe("with an empty array", () => {
      it("should return 0", () => {
        expect(countLongerPath(10)([])).toEqual(0);
      });
    });

    describe("with a multiple elements array", () => {
      it("should return the right count", () => {
        const folderList = [
          "123456/89",
          "123",
          "1/3/5/7",
          "123456789",
          "12/456",
        ];
        expect(countLongerPath(6)(folderList)).toEqual(3);
      });
    });
  });

  describe("sortFoldersByChildrenCount", () => {
    describe("with an empty array", () => {
      it("should return an empty array", () => {
        expect(sortFoldersByChildrenCount([])).toEqual([]);
      });
    });

    describe("with a standard array", () => {
      it("should return an empty array", () => {
        const foldersToSort = [
          {
            children: ["1", "2"],
          },
          {
            children: ["1", "2", "3"],
          },
          {
            children: ["3"],
          },
          {
            children: ["1", "2", "3", "4"],
          },
        ];
        expect(
          sortFoldersByChildrenCount(foldersToSort as FilesAndFolders[])
        ).toEqual([
          {
            children: ["1", "2", "3", "4"],
          },
          {
            children: ["1", "2", "3"],
          },
          {
            children: ["1", "2"],
          },
          {
            children: ["3"],
          },
        ]);
      });
    });
  });

  describe("sortFoldersByDepth", () => {
    describe("with an empty array", () => {
      it("should return an empty array", () => {
        expect(sortFoldersByDepth([])).toEqual([]);
      });
    });

    describe("with a standard array", () => {
      it("should return an empty array", () => {
        const foldersToSort = [
          {
            depth: 2,
            id: 1,
          },
          {
            depth: 3,
            id: 2,
          },
          {
            depth: 1,
            id: 3,
          },
          {
            depth: 4,
            id: 4,
          },
        ];
        expect(
          sortFoldersByDepth(foldersToSort as unknown as FilesAndFolders[])
        ).toEqual([
          {
            depth: 4,
            id: 4,
          },
          {
            depth: 3,
            id: 2,
          },
          {
            depth: 2,
            id: 1,
          },
          {
            depth: 1,
            id: 3,
          },
        ]);
      });
    });
  });

  describe("findAllFoldersWithNoSubfolder", () => {
    describe("with root element as the last subfolder", () => {
      const fileAndFolders: any = {
        "": {
          children: ["file1", "file2"],
        },
        file1: {
          children: [],
        },
        file2: {
          children: [],
        },
      };

      it("should return root element", () => {
        expect(findAllFoldersWithNoSubfolder(fileAndFolders)).toEqual([""]);
      });
    });

    describe("with a multiple levels deep file tree", () => {
      const fileAndFolders: any = {
        "": {
          children: ["folder1", "folder2", "file1"],
        },
        file1: {
          children: [],
        },
        folder1: {
          children: ["folder1/folder1", "folder1/file1"],
        },
        "folder1/file1": {
          children: [],
        },
        "folder1/folder1": {
          children: ["folder1/folder1/file1", "folder1/folder1/file2"],
        },
        "folder1/folder1/file1": {
          children: [],
        },
        "folder1/folder1/file2": {
          children: [],
        },
        folder2: {
          children: ["folder2/file1"],
        },
        "folder2/file1": {
          children: [],
        },
      };

      it("should return all the folders with no child folders", () => {
        // Order does not matter, so we sort both arrays
        expect(findAllFoldersWithNoSubfolder(fileAndFolders).sort()).toEqual(
          ["folder1/folder1", "folder2"].sort()
        );
      });
    });
  });

  describe("filesAndFoldersMapToArray", () => {
    describe("with a standard filesAndFolders data", () => {
      it("should transform data correctly", () => {
        const data: any = {
          "": {
            children: ["baseFolder"],
          },
          baseFolder: {
            children: ["baseFolder/file1", "baseFolder/file2"],
          },
          "baseFolder/file1": {
            children: [],
          },
          "baseFolder/file2": {
            children: [],
          },
        };

        expect(
          filesAndFoldersMapToArray(data).sort((ff1, ff2) =>
            ff1.id > ff2.id ? 1 : -1
          )
        ).toEqual([
          {
            children: ["baseFolder/file1", "baseFolder/file2"],
            id: "baseFolder",
          },
          {
            children: [],
            id: "baseFolder/file1",
          },
          {
            children: [],
            id: "baseFolder/file2",
          },
        ]);
      });
    });
  });

  describe("getFiles", () => {
    describe("with a standard filesAndFoldersList", () => {
      it("should return the files only", () => {
        const data: any = [
          {
            children: ["folder/file1", "folder/file2"],
            id: "folder",
          },
          {
            children: [],
            id: "folder/file1",
          },
          {
            children: [],
            id: "folder/file2",
          },
        ];

        expect(
          getFiles(data).sort((file1, file2) => (file1.id > file2.id ? 1 : -1))
        ).toEqual([
          {
            children: [],
            id: "folder/file1",
          },
          {
            children: [],
            id: "folder/file2",
          },
        ]);
      });
    });
  });

  describe("getFolders", () => {
    describe("with a standard filesAndFoldersList", () => {
      it("should return the files only", () => {
        const data: any = [
          {
            children: ["folder/file1", "folder/childFolder"],
            id: "folder",
          },
          {
            children: [],
            id: "folder/file1",
          },
          {
            children: ["folder/childFolder/file"],
            id: "folder/childFolder",
          },
          {
            children: [],
            id: "folder/childFolder/file",
          },
        ];

        expect(
          getFolders(data).sort((folder1, folder2) =>
            folder1.id > folder2.id ? 1 : -1
          )
        ).toEqual([
          {
            children: ["folder/file1", "folder/childFolder"],
            id: "folder",
          },
          {
            children: ["folder/childFolder/file"],
            id: "folder/childFolder",
          },
        ]);
      });
    });
  });

  describe("computeFolderHashes", () => {
    const setup = async (fileAndFolders: any, hashes: any) => {
      const hook = jest.fn();
      const result = await computeFolderHashes(fileAndFolders, hashes, hook);

      return { hook, result };
    };

    const childrenHash = (...children: any) => MD5(children.sort().join(""));

    describe("with a valid fileAndFolders structure", () => {
      const baseFolderId = "baseFolder";
      const filesAndFolders = {
        "": {
          children: [baseFolderId],
        },
        baseFolder: {
          children: [
            "baseFolder/folder1",
            "baseFolder/folder2",
            "baseFolder/file1",
          ],
        },
        "baseFolder/file1": {
          children: [],
        },
        "baseFolder/folder1": {
          children: ["baseFolder/folder1/file1", "baseFolder/folder1/file2"],
        },
        "baseFolder/folder1/file1": {
          children: [],
        },
        "baseFolder/folder1/file2": {
          children: [],
        },
        "baseFolder/folder2": {
          children: ["baseFolder/folder2/file1"],
        },
        "baseFolder/folder2/file1": {
          children: [],
        },
      };

      const hashes = {
        "baseFolder/file1": "c82250a7c798d52669795d3ea5701158",
        "baseFolder/folder1/file1": "6d3e9fb007bf4069e4f994c290e2841d",
        "baseFolder/folder1/file2": "115c6b34df55fab98666a584e579f6dd",
        "baseFolder/folder2/file1": "24e10ee6f2f885106f7f6473701ebfd0",
      };

      const expectedResults: any = {
        ...hashes,
      };
      expectedResults["baseFolder/folder2"] = childrenHash(
        expectedResults["baseFolder/folder2/file1"]
      );
      expectedResults["baseFolder/folder1"] = childrenHash(
        expectedResults["baseFolder/folder1/file1"],
        expectedResults["baseFolder/folder1/file2"]
      );
      expectedResults[baseFolderId] = childrenHash(
        expectedResults["baseFolder/file1"],
        expectedResults["baseFolder/folder1"],
        expectedResults["baseFolder/folder2"]
      );
      expectedResults[""] = childrenHash(expectedResults[baseFolderId]);

      const getHashObject = (id: any) => ({ [id]: expectedResults[id] });

      let hook: any = null;
      let result: any = null;

      beforeAll(async () => {
        ({ hook, result } = await setup(filesAndFolders, hashes));
      });

      it("should call the hook with the right hashes", () => {
        expect(hook).toHaveBeenCalledTimes(4);
        expect(hook).toHaveBeenCalledWith(getHashObject(""));
        expect(hook).toHaveBeenCalledWith(getHashObject("baseFolder"));
        expect(hook).toHaveBeenCalledWith(getHashObject("baseFolder/folder1"));
        expect(hook).toHaveBeenCalledWith(getHashObject("baseFolder/folder2"));
      });

      it("should return the right hashes", () => {
        expect(result).toEqual(expectedResults);
      });
    });
  });

  describe("isExactFileOrAncestor", () => {
    it("should return true when the suspected ancestor is an ancestor", () => {
      expect(
        isExactFileOrAncestor("/path/to/ancestor/child", "/path/to/ancestor")
      ).toBe(true);
    });

    it("should return true when the file and the suspected ancestor are the same", () => {
      expect(isExactFileOrAncestor("/path/to/file", "/path/to/file")).toBe(
        true
      );
    });

    it("should return false when the suspected ancestor is not an ancestor", () => {
      expect(
        isExactFileOrAncestor(
          "/path/to/ancestor/child",
          "/path/to/non-ancestor"
        )
      ).toBe(false);
    });
  });

  describe("createFilePathSequence", () => {
    it("should return the decomposed sequence", () => {
      const targetFileId = "/folder/other-folder/another-one/file-name";
      const movedFolderVirtualPath = "/folder/virtual-folder";
      const targetFileVirtualPath = "/folder/virtual-folder/file-name";
      const movedFolderId = "/folder/other-folder/another-one";
      const filesAndFolders = {
        [targetFileId]: createFilesAndFolders({
          id: targetFileId,
          virtualPath: targetFileVirtualPath,
        }),
      };

      const virtualPathToIdMap = {
        [movedFolderVirtualPath]: movedFolderId,
        [targetFileVirtualPath]: targetFileId,
      };

      expect(
        createFilePathSequence(
          targetFileId,
          filesAndFolders,
          virtualPathToIdMap
        )
      ).toEqual(["/folder", movedFolderId, targetFileId]);
    });
  });

  describe("getType", () => {
    it("should return folder when a folder is given", () => {
      const folder: any = {
        children: ["folder1"],
      };
      expect(getType(folder)).toBe("folder");
    });
    it("should return csv when a csv filePath is given", () => {
      const csvFile: any = {
        children: [],
        id: "file.csv",
      };
      expect(getType(csvFile)).toBe("csv");
    });
    it("should return unknown when an unknown file format is given", () => {
      const folder: any = {
        children: [],
        id: "file.unknown",
      };
      expect(getType(folder)).toBe("unknown");
    });
  });

  describe("getAllChildren", () => {
    const fileAndFolders: any = {
      "": {
        children: ["folder1", "folder2", "file1"],
      },
      file1: {
        children: [],
      },
      folder1: {
        children: ["folder1/folder1", "folder1/file1"],
      },
      "folder1/file1": {
        children: [],
      },
      "folder1/folder1": {
        children: ["folder1/folder1/file1", "folder1/folder1/file2"],
      },
      "folder1/folder1/file1": {
        children: [],
      },
      "folder1/folder1/file2": {
        children: [],
      },
      folder2: {
        children: ["folder2/file1"],
      },
      "folder2/file1": {
        children: [],
      },
    };

    it("should return a recursive list of all children nodes", () => {
      expect(getAllChildren(fileAndFolders, "")).toStrictEqual([
        "",
        "folder1",
        "folder1/folder1",
        "folder1/folder1/file1",
        "folder1/folder1/file2",
        "folder1/file1",
        "folder2",
        "folder2/file1",
        "file1",
      ]);
    });

    it("should return a one element list when a file is given", () => {
      expect(getAllChildren(fileAndFolders, "file1")).toStrictEqual(["file1"]);
    });
  });

  describe("getFirstLevelName", () => {
    it("should return the name of the first level element", () => {
      const filesAndFoldersMap = {
        "": createFilesAndFolders({ children: ["/file1"], id: "" }),
        "/file1": createFilesAndFolders({ children: [], id: "/file1" }),
      };
      expect(getFirstLevelName(filesAndFoldersMap)).toBe("file1");
    });
  });

  describe("removeChildrenPath", () => {
    it("should filter element which have their parent in the array", () => {
      const elements = [
        "/parent",
        "/parent/child",
        "/parent/child/child",
        "/other/element",
      ];

      expect(removeChildrenPath(elements).sort()).toEqual(
        ["/parent", "/other/element"].sort()
      );
    });
  });
});
