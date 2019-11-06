import { initFilesAndFoldersMetatada } from "./files-and-folders-metadata-actions";
import reducer from "./files-and-folders-metadata-reducer";
import { createFilesAndFoldersMetadata } from "./files-and-folders-metadata-test-utils";
import { FilesAndFoldersMetadataState } from "./files-and-folders-metadata-types";

const initialState: FilesAndFoldersMetadataState = {
  filesAndFoldersMetadata: {}
};

describe("files-and-folders-metadata-reducer", () => {
  describe("INIT_FILES_AND_FOLDERS_METADATA", () => {
    it("should set the filesAndFolders metadata", () => {
      const addedMetadata = {
        testId: createFilesAndFoldersMetadata({
          averageLastModified: 3000,
          childrenTotalSize: 10000,
          maxLastModified: 10000,
          medianLastModified: 4000,
          minLastModified: 1000
        })
      };

      const nextState = reducer(
        initialState,
        initFilesAndFoldersMetatada(addedMetadata)
      );

      expect(nextState).toEqual({
        filesAndFoldersMetadata: addedMetadata
      });
    });
  });
});
