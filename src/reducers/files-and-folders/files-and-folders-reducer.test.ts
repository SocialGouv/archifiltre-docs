import {
  addChild,
  addCommentsOnFilesAndFolders,
  initializeFilesAndFolders,
  markAsToDelete,
  removeChild,
  setFilesAndFoldersAliases,
  setFilesAndFoldersHashes,
  unmarkAsToDelete
} from "./files-and-folders-actions";
import { filesAndFoldersReducer } from "./files-and-folders-reducer";
import { createFilesAndFolders } from "./files-and-folders-test-utils";
import { FilesAndFoldersState } from "./files-and-folders-types";

const baseState: FilesAndFoldersState = {
  aliases: {},
  comments: {},
  elementsToDelete: [],
  filesAndFolders: {},
  hashes: {}
};

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
          name: "filename"
        })
      };

      expect(
        filesAndFoldersReducer(
          baseState,
          initializeFilesAndFolders(filesAndFolders)
        )
      ).toEqual({
        ...baseState,
        filesAndFolders
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
        id: parentId
      });
      const child = createFilesAndFolders({ id: childId });
      const filesAndFolders = {
        [parentId]: parent,
        [childId]: child
      };

      const state = { ...baseState, filesAndFolders };
      expect(
        filesAndFoldersReducer(state, addChild(parentId, childId))
      ).toEqual({
        ...baseState,
        filesAndFolders: {
          [parentId]: {
            ...parent,
            children: [existingChildID, childId]
          },
          [childId]: {
            ...child,
            virtualPath: "/1/base-name"
          }
        }
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
        id: parentId
      });
      const child = createFilesAndFolders({ id: childId });
      const filesAndFolders = {
        [parentId]: parent,
        [childId]: child
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
            children: [existingChildID]
          }
        }
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
        [changedId]: newAlias
      };

      const initialState: FilesAndFoldersState = {
        ...baseState,
        aliases: {
          [unchangedId]: unchangedAlias
        },
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            id: changedId
          }),
          [unchangedId]: createFilesAndFolders({
            id: unchangedId
          })
        }
      };

      const nextState = filesAndFoldersReducer(
        initialState,
        setFilesAndFoldersAliases(newAliases)
      );

      expect(nextState).toEqual({
        ...baseState,
        aliases: {
          [changedId]: newAlias,
          [unchangedId]: unchangedAlias
        },
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            id: changedId
          }),
          [unchangedId]: createFilesAndFolders({
            id: unchangedId
          })
        }
      });
    });
  });

  describe("SET_FILES_AND_FOLDERS_HASHES", () => {
    it("should replace the file and folder alias", () => {
      const changedId = "changed-id";
      const unchangedId = "unchanged-id";
      const newHash = "new-hash";
      const unchangedHash = "unchanged-hash";

      const newHashes = {
        [changedId]: newHash
      };

      const initialState: FilesAndFoldersState = {
        ...baseState,
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            id: changedId
          }),
          [unchangedId]: createFilesAndFolders({
            id: unchangedId
          })
        },
        hashes: {
          [unchangedId]: unchangedHash
        }
      };

      const nextState = filesAndFoldersReducer(
        initialState,
        setFilesAndFoldersHashes(newHashes)
      );

      expect(nextState).toEqual({
        ...baseState,
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            id: changedId
          }),
          [unchangedId]: createFilesAndFolders({
            id: unchangedId
          })
        },
        hashes: {
          [changedId]: newHash,
          [unchangedId]: unchangedHash
        }
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
        [changedId]: newComment
      };

      const initialState: FilesAndFoldersState = {
        ...baseState,
        comments: {
          [unchangedId]: unchangedComment
        },
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            id: changedId
          }),
          [unchangedId]: createFilesAndFolders({
            id: unchangedId
          })
        }
      };

      const nextState = filesAndFoldersReducer(
        initialState,
        addCommentsOnFilesAndFolders(newComments)
      );

      expect(nextState).toEqual({
        ...baseState,
        comments: {
          [changedId]: newComment,
          [unchangedId]: unchangedComment
        },
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            id: changedId
          }),
          [unchangedId]: createFilesAndFolders({
            id: unchangedId
          })
        }
      });
    });
  });

  describe("MARK_AS_TO_DELETE", () => {
    it("should add the non existing file id to the delete list", () => {
      const ffId = "test-ffid";
      const nextState = filesAndFoldersReducer(baseState, markAsToDelete(ffId));

      expect(nextState).toEqual({
        ...baseState,
        elementsToDelete: [ffId]
      });
    });

    it("should not add the existing file id to the delete list", () => {
      const ffId = "test-ffid";
      const initialState = {
        ...baseState,
        elementsToDelete: [ffId]
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
        elementsToDelete: [ffId, undeletedFfId]
      };
      const nextState = filesAndFoldersReducer(
        initialState,
        unmarkAsToDelete(undeletedFfId)
      );

      expect(nextState).toEqual({
        ...baseState,
        elementsToDelete: [ffId]
      });
    });
  });
});
