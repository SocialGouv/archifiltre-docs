import { createEmptyStore, wrapStoreWithUndoable } from "../store-test-utils";
import {
  createFilesAndFoldersMetadata,
  getFilesAndFoldersMetadataFromStore,
} from "./files-and-folders-metadata-selectors";
import { FilesAndFoldersMetadataMap } from "./files-and-folders-metadata-types";

describe("files-and-folders-metadata-selectors", () => {
  describe("getFilesAndFoldersMetadataFromStore", () => {
    it("should return the corresponding metadata on filesAndFolders", () => {
      const filesAndFoldersMetadata: FilesAndFoldersMetadataMap = {
        fileId: createFilesAndFoldersMetadata({
          averageLastModified: 200,
          childrenTotalSize: 1000,
          maxLastModified: 500,
          medianLastModified: 300,
          minLastModified: 100,
        }),
      };

      const emptyStore = createEmptyStore();

      const testStore = {
        ...emptyStore,
        filesAndFoldersMetadata: wrapStoreWithUndoable({
          filesAndFoldersMetadata,
        }),
      };

      expect(getFilesAndFoldersMetadataFromStore(testStore)).toEqual(
        filesAndFoldersMetadata
      );
    });
  });
});
