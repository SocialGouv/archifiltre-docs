import {
  initializeFilesAndFolders,
  setFilesAndFoldersAlias
} from "./files-and-folders-actions";
import { filesAndFoldersReducer } from "./files-and-folders-reducer";
import {
  FilesAndFolders,
  FilesAndFoldersState
} from "./files-and-folders-types";

/**
 * Utility function to create a prefilled filesAndFolders.
 * @param id
 * @param alias
 */
const createFilesAndFolders = (id: string, alias = ""): FilesAndFolders => ({
  alias,
  children: [],
  comments: "",
  file_last_modified: 1570625049127,
  file_size: 10,
  hash: null,
  id,
  name: "base-name"
});

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
          [changedId]: createFilesAndFolders(changedId, "base-alias"),
          [unchangedId]: createFilesAndFolders(unchangedId, unchangedAlias)
        }
      };

      const nextState = filesAndFoldersReducer(
        initialState,
        setFilesAndFoldersAlias(changedId, newAlias)
      );

      expect(nextState).toEqual({
        filesAndFolders: {
          [changedId]: createFilesAndFolders(changedId, newAlias),
          [unchangedId]: createFilesAndFolders(unchangedId, unchangedAlias)
        }
      });
    });
  });
});
