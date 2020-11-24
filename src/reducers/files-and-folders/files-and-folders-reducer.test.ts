import {
  addChild,
  addCommentsOnFilesAndFolders,
  initializeFilesAndFolders,
  initOverrideLastModified,
  initVirtualPathToIdMap,
  markAsToDelete,
  markElementsToDelete,
  overrideLastModified,
  registerErroredElements,
  removeChild,
  setFilesAndFoldersAliases,
  unmarkAsToDelete,
  unmarkElementsToDelete,
} from "./files-and-folders-actions";
import {
  filesAndFoldersReducer,
  initialState,
} from "./files-and-folders-reducer";
import { ROOT_FF_ID } from "./files-and-folders-selectors";
import { createFilesAndFolders } from "./files-and-folders-test-utils";
import { FilesAndFoldersState } from "./files-and-folders-types";
import { createArchifiltreError } from "reducers/loading-info/loading-info-selectors";

const baseState: FilesAndFoldersState = initialState;

describe("files-and-folders-reducer", () => {
  describe("INITIALIZE_FILES_AND_FOLDERS", () => {
    it("should replace the state with the provided filesAndFoldersMap", () => {
      const firstId = "/rootFolder/filename";
      const filesAndFolders = {
        [firstId]: createFilesAndFolders({
          children: [],
          file_last_modified: 1570615679168,
          file_size: 10,
          id: firstId,
          name: "filename",
        }),
      };

      expect(
        filesAndFoldersReducer(
          baseState,
          initializeFilesAndFolders(filesAndFolders)
        )
      ).toEqual({
        ...baseState,
        filesAndFolders,
      });
    });
  });

  describe("ADD_CHILD", () => {
    it("should add the element as its parent child and update the virtualPath", () => {
      const parentId = "/1";
      const childId = "/2";
      const existingChildID = "/1/3";
      const parent = createFilesAndFolders({
        children: [existingChildID],
        id: parentId,
      });
      const child = createFilesAndFolders({ id: childId });
      const filesAndFolders = {
        [parentId]: parent,
        [childId]: child,
      };

      const state = { ...baseState, filesAndFolders };
      expect(
        filesAndFoldersReducer(state, addChild(parentId, childId))
      ).toEqual({
        ...baseState,
        filesAndFolders: {
          [parentId]: {
            ...parent,
            children: [existingChildID, childId],
          },
          [childId]: {
            ...child,
            virtualPath: "/1/base-name",
          },
        },
        virtualPathToId: {
          ["/1/base-name"]: childId,
        },
      });
    });

    it("should recursively update the children virtual path", () => {
      const rootFolderId = "/root-folder";
      const folder1Id = "/root-folder/folder1";
      const folder2Id = "/root-folder/folder2";
      const file1Id = "/root-folder/folder1/file1";
      const file2Id = "/root-folder/folder2/file2";
      const rootFf = createFilesAndFolders({
        children: [rootFolderId],
        id: ROOT_FF_ID,
      });
      const rootFolder = createFilesAndFolders({
        children: [folder1Id],
        id: rootFolderId,
        name: "root-folder",
      });
      const folder1 = createFilesAndFolders({
        children: [file1Id],
        id: folder1Id,
        name: "folder1",
      });
      const folder2 = createFilesAndFolders({
        children: [file2Id],
        id: folder2Id,
        name: "folder2",
      });
      const file1 = createFilesAndFolders({ id: file1Id, name: "file1" });
      const file2 = createFilesAndFolders({ id: file2Id, name: "file2" });
      const filesAndFolders = {
        [ROOT_FF_ID]: rootFf,
        [rootFolderId]: rootFolder,
        [folder1Id]: folder1,
        [folder2Id]: folder2,
        [file1Id]: file1,
        [file2Id]: file2,
      };

      const folder2NextVirtualPath = "/root-folder/folder1/folder2";
      const file2NextVirtualPath = "/root-folder/folder1/folder2/file2";

      const initialState = { ...baseState, filesAndFolders };

      const nextState = filesAndFoldersReducer(
        initialState,
        addChild(folder1Id, folder2Id)
      );

      expect(nextState).toEqual({
        ...baseState,
        filesAndFolders: {
          ...filesAndFolders,
          [folder1Id]: { ...folder1, children: [file1Id, folder2Id] },
          [folder2Id]: {
            ...folder2,
            virtualPath: folder2NextVirtualPath,
          },
          [file2Id]: {
            ...file2,
            virtualPath: file2NextVirtualPath,
          },
        },
        virtualPathToId: {
          [folder2NextVirtualPath]: folder2Id,
          [file2NextVirtualPath]: file2Id,
        },
      });
    });
  });

  describe("REMOVE_CHILD", () => {
    it("should remove the child from the parent children", () => {
      const parentId = "/1";
      const childId = "/2";
      const existingChildID = "/1/3";
      const parent = createFilesAndFolders({
        children: [existingChildID, childId],
        id: parentId,
      });
      const child = createFilesAndFolders({ id: childId });
      const filesAndFolders = {
        [parentId]: parent,
        [childId]: child,
      };

      const state = { ...baseState, filesAndFolders };
      expect(
        filesAndFoldersReducer(state, removeChild(parentId, childId))
      ).toEqual({
        ...baseState,
        filesAndFolders: {
          ...filesAndFolders,
          [parentId]: {
            ...parent,
            children: [existingChildID],
          },
        },
      });
    });
  });

  describe("SET_FILES_AND_FOLDERS_ALIAS", () => {
    it("should replace the file and folder alias", () => {
      const changedId = "changed-id";
      const unchangedId = "unchanged-id";
      const newAlias = "new-alias";
      const unchangedAlias = "unchanged-alias";

      const newAliases = {
        [changedId]: newAlias,
      };

      const initialState: FilesAndFoldersState = {
        ...baseState,
        aliases: {
          [unchangedId]: unchangedAlias,
        },
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            id: changedId,
          }),
          [unchangedId]: createFilesAndFolders({
            id: unchangedId,
          }),
        },
      };

      const nextState = filesAndFoldersReducer(
        initialState,
        setFilesAndFoldersAliases(newAliases)
      );

      expect(nextState).toEqual({
        ...baseState,
        aliases: {
          [changedId]: newAlias,
          [unchangedId]: unchangedAlias,
        },
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            id: changedId,
          }),
          [unchangedId]: createFilesAndFolders({
            id: unchangedId,
          }),
        },
      });
    });
  });

  describe("ADD_COMMENT_ON_FILES_AND_FOLDERS", () => {
    it("should add a comment on the file and folder", () => {
      const changedId = "changed-id";
      const unchangedId = "unchanged-id";
      const newComment = "new-comment";
      const unchangedComment = "unchanged-comment";

      const newComments = {
        [changedId]: newComment,
      };

      const initialState: FilesAndFoldersState = {
        ...baseState,
        comments: {
          [unchangedId]: unchangedComment,
        },
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            id: changedId,
          }),
          [unchangedId]: createFilesAndFolders({
            id: unchangedId,
          }),
        },
      };

      const nextState = filesAndFoldersReducer(
        initialState,
        addCommentsOnFilesAndFolders(newComments)
      );

      expect(nextState).toEqual({
        ...baseState,
        comments: {
          [changedId]: newComment,
          [unchangedId]: unchangedComment,
        },
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            id: changedId,
          }),
          [unchangedId]: createFilesAndFolders({
            id: unchangedId,
          }),
        },
      });
    });
  });

  describe("MARK_AS_TO_DELETE", () => {
    it("should add the non existing file id to the delete list", () => {
      const ffId = "test-ffid";
      const nextState = filesAndFoldersReducer(baseState, markAsToDelete(ffId));

      expect(nextState).toEqual({
        ...baseState,
        elementsToDelete: [ffId],
      });
    });

    it("should not add the existing file id to the delete list", () => {
      const ffId = "test-ffid";
      const initialState = {
        ...baseState,
        elementsToDelete: [ffId],
      };
      const nextState = filesAndFoldersReducer(
        initialState,
        markAsToDelete(ffId)
      );

      expect(nextState).toEqual(initialState);
    });
  });

  describe("UNMARK_AS_TO_DELETE", () => {
    it("should remove the existing file id from the delete list", () => {
      const ffId = "test-ffid";
      const undeletedFfId = "deleted-ffid";
      const initialState = {
        ...baseState,
        elementsToDelete: [ffId, undeletedFfId],
      };
      const nextState = filesAndFoldersReducer(
        initialState,
        unmarkAsToDelete(undeletedFfId)
      );

      expect(nextState).toEqual({
        ...baseState,
        elementsToDelete: [ffId],
      });
    });
  });

  describe("MARK_ELEMENTS_TO_DELETE", () => {
    it("should add all element marked only once", () => {
      const existingId = "existing-id";
      const duplicatedId = "duplicated-id";
      const newId = "new-id";
      const elementsIds = [duplicatedId, newId];
      const initialState = {
        ...baseState,
        elementsToDelete: [existingId, duplicatedId],
      };

      const nextState = filesAndFoldersReducer(
        initialState,
        markElementsToDelete(elementsIds)
      );

      expect(nextState).toEqual({
        ...baseState,
        elementsToDelete: [existingId, duplicatedId, newId],
      });
    });
  });

  describe("UNMARK_ELEMENTS_TO_DELETE", () => {
    it("should add all element marked only once", () => {
      const removedId1 = "removed-id";
      const removedId2 = "removed-id-2";
      const remainingId = "remaining-id";
      const elementsIds = [removedId1, remainingId, removedId2];
      const initialState = {
        ...baseState,
        elementsToDelete: elementsIds,
      };

      const nextState = filesAndFoldersReducer(
        initialState,
        unmarkElementsToDelete([removedId1, removedId2])
      );

      expect(nextState).toEqual({
        ...baseState,
        elementsToDelete: [remainingId],
      });
    });
  });

  describe("INIT_VIRTUAL_PATH_TO_ID_MAP", () => {
    it("should initialize the map", () => {
      const virtualPathToId = {
        "virtual-path": "id",
      };

      const nextState = filesAndFoldersReducer(
        baseState,
        initVirtualPathToIdMap(virtualPathToId)
      );

      expect(nextState).toEqual({
        ...baseState,
        virtualPathToId,
      });
    });
  });

  describe("REGISTER_ERRORED_ELEMENTS", () => {
    it("should register errored elements", () => {
      const nextState = filesAndFoldersReducer(
        baseState,
        registerErroredElements([createArchifiltreError({})])
      );

      expect(nextState).toEqual({
        ...nextState,
        erroredFilesAndFolders: [createArchifiltreError({})],
      });
    });
  });

  describe("OVERRIDE_LAST_MODIFIED", () => {
    it("should register the override", () => {
      const overiddenId = "overriden-id";
      const newDate = 10289893;
      const nextState = filesAndFoldersReducer(
        baseState,
        overrideLastModified(overiddenId, newDate)
      );

      expect(nextState).toEqual({
        ...nextState,
        overrideLastModified: {
          [overiddenId]: newDate,
        },
      });
    });
  });

  describe("INIT_OVERRIDE_LAST_MODIFIED", () => {
    it("should register the override", () => {
      const override = {
        id: 1000,
      };
      const nextState = filesAndFoldersReducer(
        baseState,
        initOverrideLastModified(override)
      );

      expect(nextState).toEqual({
        ...nextState,
        overrideLastModified: override,
      });
    });
  });
});
