import { flatten } from "lodash";
import { toArray } from "rxjs/operators";

import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";
import type { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { computeTreeStructureArray } from "./tree-representation";

describe("tree-representation", () => {
  describe("computeTreeStructureArray", () => {
    it("should correctly represent file structure", async () => {
      const filesAndFoldersMap: FilesAndFoldersMap = {
        "": createFilesAndFolders({ children: ["/root"], id: "" }),
        "/root": createFilesAndFolders({
          children: ["/root/folder"],
          id: "/root",
          name: "root",
        }),
        "/root/child1": createFilesAndFolders({
          id: "/root/child1",
          name: "child1",
          virtualPath: "/root/folder/child1",
        }),
        "/root/folder": createFilesAndFolders({
          children: ["/root/folder/child", "/root/child1"],
          id: "/root/folder",
          name: "folder",
        }),
        "/root/folder/child": createFilesAndFolders({
          id: "/root/folder/child",
          name: "child",
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
