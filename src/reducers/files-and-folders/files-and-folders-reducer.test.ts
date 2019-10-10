import {
  addCommentsOnFilesAndFolders,
  initializeFilesAndFolders,
  setFilesAndFoldersAlias,
  setFilesAndFoldersHash
} from "./files-and-folders-actions";
import { filesAndFoldersReducer } from "./files-and-folders-reducer";
import { createFilesAndFolders } from "./files-and-folders-test-utils";
import { FilesAndFoldersState } from "./files-and-folders-types";

describe("files-and-folders-reducer", () => {
  describe("INITIALIZE_FILES_AND_FOLDERS", () => {
    const initialState: FilesAndFoldersState = {
      filesAndFolders: {}
    };

    it("should replace the state with the provided filesAndFoldersMap", () => {
      const firstId = "/rootFolder/filename";
      const filesAndFolders = {
        [firstId]: {
          alias: "",
          children: [],
          comments: "",
          file_last_modified: 1570615679168,
          file_size: 10,
          hash: null,
          id: firstId,
          name: "filename"
        }
      };

      expect(
        filesAndFoldersReducer(
          initialState,
          initializeFilesAndFolders(filesAndFolders)
        )
      ).toEqual({
        filesAndFolders
      });
    });
  });

  describe("SET_FILES_AND_FOLDERS_ALIAS", () => {
    it("should replace the file and folder alias", () => {
      const changedId = "changed-id";
      const unchangedId = "unchanged-id";
      const newAlias = "new-alias";
      const unchangedAlias = "unchanged-alias";

      const initialState: FilesAndFoldersState = {
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            alias: "base-alias",
            id: changedId
          }),
          [unchangedId]: createFilesAndFolders({
            alias: unchangedAlias,
            id: unchangedId
          })
        }
      };

      const nextState = filesAndFoldersReducer(
        initialState,
        setFilesAndFoldersAlias(changedId, newAlias)
      );

      expect(nextState).toEqual({
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            alias: newAlias,
            id: changedId
          }),
          [unchangedId]: createFilesAndFolders({
            alias: unchangedAlias,
            id: unchangedId
          })
        }
      });
    });
  });

  describe("SET_FILES_AND_FOLDERS_HASH", () => {
    it("should replace the file and folder alias", () => {
      const changedId = "changed-id";
      const unchangedId = "unchanged-id";
      const newHash = "new-hash";

      const initialState: FilesAndFoldersState = {
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            hash: "base-hash",
            id: changedId
          }),
          [unchangedId]: createFilesAndFolders({
            id: unchangedId
          })
        }
      };

      const nextState = filesAndFoldersReducer(
        initialState,
        setFilesAndFoldersHash(changedId, newHash)
      );

      expect(nextState).toEqual({
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            hash: newHash,
            id: changedId
          }),
          [unchangedId]: createFilesAndFolders({
            id: unchangedId
          })
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

      const initialState: FilesAndFoldersState = {
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            comments: "base-comments",
            id: changedId
          }),
          [unchangedId]: createFilesAndFolders({ id: unchangedId })
        }
      };

      const nextState = filesAndFoldersReducer(
        initialState,
        addCommentsOnFilesAndFolders(changedId, newComment)
      );

      expect(nextState).toEqual({
        filesAndFolders: {
          [changedId]: createFilesAndFolders({
            comments: newComment,
            id: changedId
          }),
          [unchangedId]: createFilesAndFolders({
            comments: unchangedComment,
            id: unchangedId
          })
        }
      });
    });
  });
});
