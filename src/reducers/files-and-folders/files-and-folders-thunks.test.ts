import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { DispatchExts } from "../archifiltre-types";
import { StoreState } from "../store";
import { createEmptyStore, wrapStoreWithUndoable } from "../store-test-utils";
import {
  addCommentsOnFilesAndFolders,
  setFilesAndFoldersAliases,
  setFilesAndFoldersHashes,
} from "./files-and-folders-actions";
import { initialState as filesAndFoldersInitialState } from "./files-and-folders-reducer";
import { createFilesAndFolders } from "./files-and-folders-test-utils";
import {
  updateAliasThunk,
  updateCommentThunk,
  updateFilesAndFoldersHashes,
} from "./files-and-folders-thunks";

jest.mock("../../logging/tracker", () => ({
  addTracker: jest.fn(),
}));

const mockStore = configureMockStore<StoreState, DispatchExts>([thunk]);

const emptyStoreState = createEmptyStore();
const updateId1 = "update-1";
const updateId2 = "update-2";
const unupdatedId = "no-update";
const newHash1 = "new-hash-1";
const newHash2 = "new-hash-2";

const testState = {
  ...emptyStoreState,
  filesAndFolders: wrapStoreWithUndoable({
    ...filesAndFoldersInitialState,
    filesAndFolders: {
      [updateId1]: createFilesAndFolders({
        id: updateId1,
      }),
      [updateId2]: createFilesAndFolders({
        hash: "oldHash2",
        id: updateId2,
      }),
      [unupdatedId]: createFilesAndFolders({
        hash: "unchangedHash",
        id: unupdatedId,
      }),
    },
  }),
};

describe("file-and-folders-thunks.test.ts", () => {
  describe("updateFilesAndFolderHashes", () => {
    it("should dispatch an update action for each ff", () => {
      const hashes = {
        [updateId1]: newHash1,
        [updateId2]: newHash2,
      };

      const store = mockStore(testState);

      store.dispatch(updateFilesAndFoldersHashes(hashes));

      const actions = store.getActions();

      expect(actions).toEqual([setFilesAndFoldersHashes(hashes)]);
    });
  });

  describe("updateAliasThunk", () => {
    it("should dispatch the right action", () => {
      const store = mockStore(testState);
      const ffId = "ff-id";
      const alias = "new-alias";
      store.dispatch(updateAliasThunk(ffId, alias));

      expect(store.getActions()).toEqual([
        setFilesAndFoldersAliases({ [ffId]: alias }),
      ]);
    });
  });

  describe("updateCommentThunk", () => {
    it("should dispatch the right action", () => {
      const store = mockStore(testState);
      const ffId = "ff-id";
      const comment = "new-comment";
      store.dispatch(updateCommentThunk(ffId, comment));

      expect(store.getActions()).toEqual([
        addCommentsOnFilesAndFolders({ [ffId]: comment }),
      ]);
    });
  });
});
