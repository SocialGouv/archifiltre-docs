import { createFilesAndFolders } from "reducers/files-and-folders/files-and-folders-test-utils";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import {
  removeIgnoredFilesAndFoldersFromVirtualFileSystem,
  removeUnusedAliasesFromVirtualFileSystem,
  removeUnusedCommentsFromVirtualFileSystem,
  removeUnusedTagsFromVirtualFileSystem,
} from "util/virtual-file-system-util/virtual-file-system-util";
import { createTag } from "reducers/tags/tags-test-util";

const folderId = "/root/folder";
const hiddenFileId = "/root/folder/hidden.tmp";
const normalFileId = "/root/folder/normal";
const emptyFolderId = "/root/folder/empty";
const hiddenInEmptyId = "/root/folder/empty/hidden.tmp";

const filesAndFolders: FilesAndFoldersMap = {
  "": createFilesAndFolders({
    id: "",
    children: ["/root"],
  }),
  "/root": createFilesAndFolders({
    id: "/root",
    children: [folderId],
  }),
  [folderId]: createFilesAndFolders({
    id: folderId,
    children: [hiddenFileId, normalFileId, emptyFolderId],
  }),
  [hiddenFileId]: createFilesAndFolders({
    id: hiddenFileId,
  }),
  [normalFileId]: createFilesAndFolders({
    id: normalFileId,
  }),
  [emptyFolderId]: createFilesAndFolders({
    id: emptyFolderId,
    children: [hiddenInEmptyId],
  }),
  [hiddenInEmptyId]: createFilesAndFolders({
    id: hiddenInEmptyId,
  }),
};

const cleanFilesAndFolders = {
  "": createFilesAndFolders({
    id: "",
    children: ["/root"],
  }),
  "/root": createFilesAndFolders({
    id: "/root",
    children: [folderId],
  }),
  [folderId]: createFilesAndFolders({
    id: folderId,
    children: [normalFileId],
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
          filesAndFolders: cleanFilesAndFolders,
          comments: baseComments,
        })
      ).toEqual({
        filesAndFolders: cleanFilesAndFolders,
        comments: expectedComments,
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
          filesAndFolders: cleanFilesAndFolders,
          aliases: baseAliases,
        })
      ).toEqual({
        filesAndFolders: cleanFilesAndFolders,
        aliases: expectedAliases,
      });
    });
  });

  describe("removeUnusedTagsFormVirtualFileSystem", () => {
    it("should remove tags for non existing filesAndFolders", () => {
      const unchangedTagId = "tag-id";
      const changedTagId = "changed-tag-id";
      const removedTagId = "removed-tag-id";

      const baseTags = {
        [unchangedTagId]: createTag({
          id: unchangedTagId,
          ffIds: [normalFileId],
        }),
        [changedTagId]: createTag({
          id: changedTagId,
          ffIds: [normalFileId, hiddenFileId],
        }),
        [removedTagId]: createTag({
          id: removedTagId,
          ffIds: [hiddenFileId],
        }),
      };

      const expectedTags = {
        [unchangedTagId]: createTag({
          id: unchangedTagId,
          ffIds: [normalFileId],
        }),
        [changedTagId]: createTag({
          id: changedTagId,
          ffIds: [normalFileId],
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
