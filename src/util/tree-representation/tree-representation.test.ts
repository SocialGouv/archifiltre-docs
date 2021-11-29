import { flatten } from "lodash";
import { createFilesAndFolders } from "reducers/files-and-folders/files-and-folders-test-utils";
import { toArray } from "rxjs/operators";
import { computeTreeStructureArray } from "util/tree-representation/tree-representation";

describe("tree-representation", () => {
    describe("computeTreeStructureArray", () => {
        it("should correctly represent file structure", async () => {
            const filesAndFoldersMap = {
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
