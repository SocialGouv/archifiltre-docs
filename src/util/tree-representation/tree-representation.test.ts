import { createFilesAndFolders } from "reducers/files-and-folders/files-and-folders-test-utils";
import { computeTreeStructureArray } from "util/tree-representation/tree-representation";
import { toArray } from "rxjs/operators";
import { flatten } from "lodash";

describe("tree-representation", () => {
  describe("computeTreeStructureArray", () => {
    it("should correctly represent file structure", async () => {
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

      const result = await computeTreeStructureArray(filesAndFoldersMap)
        .pipe(toArray())
        .toPromise();
      const flatResult = flatten(result);
      expect(flatResult).toEqual([
        ["root"],
        ["", "folder"],
        ["", "", "child"],
        ["", "", "child1"],
      ]);
    });
  });
});
