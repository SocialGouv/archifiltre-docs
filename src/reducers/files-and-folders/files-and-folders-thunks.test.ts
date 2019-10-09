import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { DispatchExts } from "../archifiltre-types";
import { StoreState } from "../store";
import { createEmptyStore } from "../store-test-utils";
import { setFilesAndFoldersHash } from "./files-and-folders-actions";
import { createFilesAndFolders } from "./files-and-folders-test-utils";
import { updateFilesAndFolderHashes } from "./files-and-folders-thunks";

const mockStore = configureMockStore<StoreState, DispatchExts>([thunk]);

describe("file-and-folders-thunks.test.ts", () => {
  describe("updateFilesAndFolderHashes", () => {
    it("should dispatch an update action for each ff", () => {
      const emptyStoreState = createEmptyStore();
      const updateId1 = "update-1";
      const updateId2 = "update-2";
      const unupdatedId = "no-update";
      const newHash1 = "new-hash-1";
      const newHash2 = "new-hash-2";

      const testState = {
        ...emptyStoreState,
        filesAndFolders: {
          ...emptyStoreState.filesAndFolders,
          current: {
            filesAndFolders: {
              [updateId1]: createFilesAndFolders({
                hash: "oldHash",
                id: updateId1
              }),
              [updateId2]: createFilesAndFolders({
                hash: "oldHash2",
                id: updateId2
              }),
              [unupdatedId]: createFilesAndFolders({
                hash: "unchangedHash",
                id: unupdatedId
              })
            }
          }
        }
      };

      const store = mockStore(testState);

      store.dispatch(
        updateFilesAndFolderHashes({
          [updateId1]: newHash1,
          [updateId2]: newHash2
        })
      );

      const actions = store.getActions();

      expect(actions).toEqual([
        setFilesAndFoldersHash(updateId1, newHash1),
        setFilesAndFoldersHash(updateId2, newHash2)
      ]);
    });
  });
});
