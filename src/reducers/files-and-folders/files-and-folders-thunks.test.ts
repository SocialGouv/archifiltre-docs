import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { createFilesAndFoldersMetadataDataStructure } from "../../files-and-folders-loader/files-and-folders-loader";
import { DispatchExts } from "../archifiltre-types";
import { initFilesAndFoldersMetatada } from "../files-and-folders-metadata/files-and-folders-metadata-actions";
import { createFilesAndFoldersMetadata } from "../files-and-folders-metadata/files-and-folders-metadata-test-utils";
import { StoreState } from "../store";
import { createEmptyStore, wrapStoreWithUndoable } from "../store-test-utils";
import {
  addChild,
  addCommentsOnFilesAndFolders,
  removeChild,
  setFilesAndFoldersAliases,
  setFilesAndFoldersHashes
} from "./files-and-folders-actions";
import {
  initialState,
  initialState as filesAndFoldersInitialState
} from "./files-and-folders-reducer";
import { ROOT_FF_ID } from "./files-and-folders-selectors";
import { createFilesAndFolders } from "./files-and-folders-test-utils";
import {
  moveElement,
  updateAliasThunk,
  updateCommentThunk,
  updateFilesAndFoldersHashes
} from "./files-and-folders-thunks";
import { ADD_CHILD } from "./files-and-folders-types";

jest.mock("../../logging/tracker", () => ({
  addTracker: jest.fn()
}));

jest.mock("../../files-and-folders-loader/files-and-folders-loader", () => ({
  createFilesAndFoldersMetadataDataStructure: jest.fn()
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
        id: updateId1
      }),
      [updateId2]: createFilesAndFolders({
        id: updateId2
      }),
      [unupdatedId]: createFilesAndFolders({
        id: unupdatedId
      })
    }
  })
};

describe("file-and-folders-thunks.test.ts", () => {
  describe("", () => {
    it("should do the right steps to move the element", () => {
      const rootFolderId = "/root-folder";
      const file1Id = "/root-folder/file-1-id";
      const folderId = "/root-folder/folder";
      const file2Id = "/root-folder/folder/file-2-id";
      const filesAndFolders = {
        [ROOT_FF_ID]: createFilesAndFolders({
          children: [rootFolderId],
          id: ""
        }),
        [rootFolderId]: createFilesAndFolders({
          children: [file1Id, folderId],
          id: rootFolderId
        }),
        [file1Id]: createFilesAndFolders({ id: file1Id }),
        [folderId]: createFilesAndFolders({
          children: [file2Id],
          id: folderId
        }),
        [file2Id]: createFilesAndFolders({ id: file2Id })
      };

      const filesAndFolders2 = {
        ...filesAndFolders,
        [file1Id]: createFilesAndFolders({
          id: file1Id,
          virtualPath: `${folderId}/file-1-id`
        }),
        [folderId]: createFilesAndFolders({
          children: [file2Id, file1Id],
          id: folderId
        }),
        [rootFolderId]: createFilesAndFolders({
          children: [folderId],
          id: rootFolderId
        })
      };

      const state1 = {
        ...createEmptyStore(),
        filesAndFolders: wrapStoreWithUndoable({
          ...initialState,
          filesAndFolders
        })
      };
      const state2 = {
        ...createEmptyStore(),
        filesAndFolders: wrapStoreWithUndoable({
          ...initialState,
          filesAndFolders: filesAndFolders2
        })
      };

      const createFilesAndFoldersMetadataDataStructureMock = createFilesAndFoldersMetadataDataStructure as jest.Mock;
      const newMetadata = {
        [file1Id]: createFilesAndFoldersMetadata({})
      };

      createFilesAndFoldersMetadataDataStructureMock.mockReturnValue(
        newMetadata
      );

      let addChildCalled = false;
      const store = mockStore(() => (addChildCalled ? state2 : state1));
      store.subscribe(() => {
        const actions = store.getActions();
        if (actions[actions.length - 1].type === ADD_CHILD) {
          addChildCalled = true;
        }
      });

      store.dispatch(moveElement(file1Id, folderId));

      expect(
        createFilesAndFoldersMetadataDataStructureMock
      ).toHaveBeenCalledWith(filesAndFolders2);

      expect(store.getActions()).toEqual([
        removeChild(rootFolderId, file1Id),
        addChild(folderId, file1Id),
        initFilesAndFoldersMetatada(newMetadata)
      ]);
    });
  });
  describe("updateFilesAndFolderHashes", () => {
    it("should dispatch an update action for each ff", () => {
      const hashes = {
        [updateId1]: newHash1,
        [updateId2]: newHash2
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
        setFilesAndFoldersAliases({ [ffId]: alias })
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
        addCommentsOnFilesAndFolders({ [ffId]: comment })
      ]);
    });
  });
});
