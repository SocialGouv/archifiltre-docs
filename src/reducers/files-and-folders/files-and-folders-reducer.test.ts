import { initializeFilesAndFolders } from "./files-and-folders-actions";
import { filesAndFoldersReducer } from "./files-and-folders-reducer";
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
});
