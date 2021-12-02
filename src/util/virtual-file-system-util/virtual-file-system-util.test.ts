import { createFilesAndFolders } from "reducers/files-and-folders/files-and-folders-test-utils";
import type { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { createTag } from "reducers/tags/tags-test-util";
import {
    removeIgnoredFilesAndFoldersFromVirtualFileSystem,
    removeUnusedAliasesFromVirtualFileSystem,
    removeUnusedCommentsFromVirtualFileSystem,
    removeUnusedTagsFromVirtualFileSystem,
} from "util/virtual-file-system-util/virtual-file-system-util";

const folderId = "/root/folder";
const hiddenFileId = "/root/folder/hidden.tmp";
const normalFileId = "/root/folder/normal";
const emptyFolderId = "/root/folder/empty";
const hiddenInEmptyId = "/root/folder/empty/hidden.tmp";

const filesAndFolders: FilesAndFoldersMap = {
    "": createFilesAndFolders({
        children: ["/root"],
        id: "",
    }),
    "/root": createFilesAndFolders({
        children: [folderId],
        id: "/root",
    }),
    [emptyFolderId]: createFilesAndFolders({
        children: [hiddenInEmptyId],
        id: emptyFolderId,
    }),
    [folderId]: createFilesAndFolders({
        children: [hiddenFileId, normalFileId, emptyFolderId],
        id: folderId,
    }),
    [hiddenFileId]: createFilesAndFolders({
        id: hiddenFileId,
    }),
    [hiddenInEmptyId]: createFilesAndFolders({
        id: hiddenInEmptyId,
    }),
    [normalFileId]: createFilesAndFolders({
        id: normalFileId,
    }),
};

const cleanFilesAndFolders = {
    "": createFilesAndFolders({
        children: ["/root"],
        id: "",
    }),
    "/root": createFilesAndFolders({
        children: [folderId],
        id: "/root",
    }),
    [folderId]: createFilesAndFolders({
        children: [normalFileId],
        id: folderId,
    }),
    [normalFileId]: createFilesAndFolders({
        id: normalFileId,
    }),
};

describe("virtual-file-system-util", () => {
    describe("removeHiddenFilesAndFoldersFromVirtualFileSystem", () => {
        it("should remove the ignored files", () => {
            expect(
                removeIgnoredFilesAndFoldersFromVirtualFileSystem({
                    filesAndFolders,
                })
            ).toEqual({
                filesAndFolders: cleanFilesAndFolders,
            });
        });
    });

    describe("removeUnusedCommentsFromVirtualFileSystem", () => {
        it("should remove comments for non existing filesAndFolders", () => {
            const expectedComments = {
                "/root": "rootComment",
                [normalFileId]: "fileComment",
            };

            const baseComments = {
                ...expectedComments,
                [hiddenFileId]: "hiddenFileComment",
            };
            expect(
                removeUnusedCommentsFromVirtualFileSystem({
                    comments: baseComments,
                    filesAndFolders: cleanFilesAndFolders,
                })
            ).toEqual({
                comments: expectedComments,
                filesAndFolders: cleanFilesAndFolders,
            });
        });
    });

    describe("removeUnusedAliasesFromVirtualFileSystem", () => {
        it("should remove comments for non existing filesAndFolders", () => {
            const expectedAliases = {
                "/root": "rootAlias",
                [normalFileId]: "fileAlias",
            };

            const baseAliases = {
                ...expectedAliases,
                [hiddenFileId]: "hiddenFileAlias",
            };
            expect(
                removeUnusedAliasesFromVirtualFileSystem({
                    aliases: baseAliases,
                    filesAndFolders: cleanFilesAndFolders,
                })
            ).toEqual({
                aliases: expectedAliases,
                filesAndFolders: cleanFilesAndFolders,
            });
        });
    });

    describe("removeUnusedTagsFormVirtualFileSystem", () => {
        it("should remove tags for non existing filesAndFolders", () => {
            const unchangedTagId = "tag-id";
            const changedTagId = "changed-tag-id";
            const removedTagId = "removed-tag-id";

            const baseTags = {
                [changedTagId]: createTag({
                    ffIds: [normalFileId, hiddenFileId],
                    id: changedTagId,
                }),
                [removedTagId]: createTag({
                    ffIds: [hiddenFileId],
                    id: removedTagId,
                }),
                [unchangedTagId]: createTag({
                    ffIds: [normalFileId],
                    id: unchangedTagId,
                }),
            };

            const expectedTags = {
                [changedTagId]: createTag({
                    ffIds: [normalFileId],
                    id: changedTagId,
                }),
                [unchangedTagId]: createTag({
                    ffIds: [normalFileId],
                    id: unchangedTagId,
                }),
            };

            expect(
                removeUnusedTagsFromVirtualFileSystem({
                    filesAndFolders: cleanFilesAndFolders,
                    tags: baseTags,
                })
            ).toEqual({
                filesAndFolders: cleanFilesAndFolders,
                tags: expectedTags,
            });
        });
    });
});
