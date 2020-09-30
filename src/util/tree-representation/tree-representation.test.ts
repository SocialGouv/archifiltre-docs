import { createFilesAndFolders } from "reducers/files-and-folders/files-and-folders-test-utils";
import { computeTreeStructureArray } from "util/tree-representation/tree-representation";

describe("tree-representation", () => {
  describe("computeTreeStructureArray", () => {
    it("should correctly represent file structure", () => {
      const filesAndFoldersMap = {
        "": createFilesAndFolders({ id: "", children: ["/root"] }),
        "/root": createFilesAndFolders({
          id: "/root",
          children: ["/root/folder"],
          name: "root",
        }),
        "/root/folder": createFilesAndFolders({
          id: "/root/folder",
          children: ["/root/folder/child", "/root/child1"],
          name: "folder",
        }),
        "/root/folder/child": createFilesAndFolders({
          id: "/root/folder/child",
          name: "child",
        }),
        "/root/child1": createFilesAndFolders({
          id: "/root/child1",
          virtualPath: "/root/folder/child1",
          name: "child1",
        }),
      };

      expect(computeTreeStructureArray(filesAndFoldersMap)).toEqual([
        ["root"],
        ["", "folder"],
        ["", "", "child"],
        ["", "", "child1"],
      ]);
    });
  });
});
