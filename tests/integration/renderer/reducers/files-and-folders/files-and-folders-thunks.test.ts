import { createFilesAndFoldersMetadataDataStructure } from "@renderer/files-and-folders-loader/file-system-loading-process-utils";
import type { DispatchExts } from "@renderer/reducers/archifiltre-types";
import { commitAction } from "@renderer/reducers/enhancers/undoable/undoable-actions";
import {
  addChild,
  addCommentsOnFilesAndFolders,
  overrideLastModified,
  removeChild,
  setFilesAndFoldersAliases,
} from "@renderer/reducers/files-and-folders/files-and-folders-actions";
import {
  initialState as filesAndFoldersInitialState,
  initialState,
} from "@renderer/reducers/files-and-folders/files-and-folders-reducer";
import { ROOT_FF_ID } from "@renderer/reducers/files-and-folders/files-and-folders-selectors";
import {
  moveElement,
  overrideLastModifiedDateThunk,
  updateAliasThunk,
  updateCommentThunk,
} from "@renderer/reducers/files-and-folders/files-and-folders-thunks";
import { ADD_CHILD } from "@renderer/reducers/files-and-folders/files-and-folders-types";
import { initFilesAndFoldersMetatada } from "@renderer/reducers/files-and-folders-metadata/files-and-folders-metadata-actions";
import { createFilesAndFoldersMetadata } from "@renderer/reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { setFilesAndFoldersHashes } from "@renderer/reducers/hashes/hashes-actions";
import { updateFilesAndFoldersHashes } from "@renderer/reducers/hashes/hashes-thunks";
import type { StoreState } from "@renderer/reducers/store";
import { translations } from "@renderer/translations/translations";
import { notifyInfo } from "@renderer/utils/notifications";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { createEmptyStore, wrapStoreWithUndoable } from "../store-test-utils";
import { createFilesAndFolders } from "./files-and-folders-test-utils";

jest.mock("@renderer/utils/notifications", () => ({
  notifyInfo: jest.fn(),
}));

jest.mock(
  "@renderer/files-and-folders-loader/file-system-loading-process-utils",
  () => ({
    createFilesAndFoldersMetadataDataStructure: jest.fn(),
  })
);

const notifyInfoMock = notifyInfo as jest.Mock;
const mockStore = configureMockStore<StoreState, DispatchExts>([thunk]);

const emptyStoreState = createEmptyStore();
const updateId1 = "update-1";
const updateId2 = "update-2";
const unupdatedId = "no-update";
const newHash1 = "new-hash-1";
const newHash2 = "new-hash-2";

const filesAndFoldersSample = {
  [unupdatedId]: createFilesAndFolders({
    id: unupdatedId,
  }),
  [updateId1]: createFilesAndFolders({
    id: updateId1,
  }),
  [updateId2]: createFilesAndFolders({
    id: updateId2,
  }),
};

const testState = {
  ...emptyStoreState,
  filesAndFolders: wrapStoreWithUndoable({
    ...filesAndFoldersInitialState,
    filesAndFolders: filesAndFoldersSample,
  }),
};

describe("file-and-folders-thunks.test.ts", () => {
  describe("moveElement", () => {
    const rootFolderId = "/root-folder";
    const file1Id = "/root-folder/file-1-id";
    const folderId = "/root-folder/folder";
    const file2Id = "/root-folder/folder/file-2-id";
    const filesAndFolders = {
      [ROOT_FF_ID]: createFilesAndFolders({
        children: [rootFolderId],
        id: "",
      }),
      [file1Id]: createFilesAndFolders({ id: file1Id, name: "test" }),
      [file2Id]: createFilesAndFolders({ id: file2Id }),
      [folderId]: createFilesAndFolders({
        children: [file2Id],
        id: folderId,
      }),
      [rootFolderId]: createFilesAndFolders({
        children: [file1Id, folderId],
        id: rootFolderId,
      }),
    };

    const filesAndFolders2 = {
      ...filesAndFolders,
      [file1Id]: createFilesAndFolders({
        id: file1Id,
        virtualPath: `${folderId}/file-1-id`,
      }),
      [folderId]: createFilesAndFolders({
        children: [file2Id, file1Id],
        id: folderId,
      }),
      [rootFolderId]: createFilesAndFolders({
        children: [folderId],
        id: rootFolderId,
      }),
    };

    const state1 = {
      ...createEmptyStore(),
      filesAndFolders: wrapStoreWithUndoable({
        ...initialState,
        filesAndFolders,
      }),
    };
    const state2 = {
      ...createEmptyStore(),
      filesAndFolders: wrapStoreWithUndoable({
        ...initialState,
        filesAndFolders: filesAndFolders2,
      }),
    };

    const createFilesAndFoldersMetadataDataStructureMock =
      createFilesAndFoldersMetadataDataStructure as jest.Mock;
    const newMetadata = {
      [file1Id]: createFilesAndFoldersMetadata({}),
    };

    beforeEach(() => {
      notifyInfoMock.mockReset();
      createFilesAndFoldersMetadataDataStructureMock.mockReset();
    });

    it("should do the right steps to move the element", () => {
      let addChildCalled = false;
      createFilesAndFoldersMetadataDataStructureMock.mockReturnValue(
        newMetadata
      );
      const store = mockStore(() => (addChildCalled ? state2 : state1));
      store.subscribe(() => {
        const actions = store.getActions();
        if (actions[actions.length - 1].type === ADD_CHILD) {
          addChildCalled = true;
        }
      });

      void store.dispatch(moveElement(file1Id, folderId));

      expect(
        createFilesAndFoldersMetadataDataStructureMock
      ).toHaveBeenCalledWith(filesAndFolders2);

      expect(store.getActions()).toEqual([
        removeChild(rootFolderId, file1Id),
        addChild(folderId, file1Id),
        initFilesAndFoldersMetatada(newMetadata),
        commitAction(),
      ]);
    });
    it("should block an element move from a parent to its child", () => {
      const store = mockStore(() => state1);

      void store.dispatch(moveElement(rootFolderId, folderId));

      expect(
        createFilesAndFoldersMetadataDataStructureMock
      ).not.toHaveBeenCalled();

      expect(notifyInfoMock).toHaveBeenCalledWith(
        translations.t("workspace.cannotMoveToChild"),
        translations.t("workspace.impossibleMove")
      );
    });
    it("should block an element move to a file element", () => {
      const store = mockStore(() => state2);

      void store.dispatch(moveElement(file1Id, file2Id));

      expect(
        createFilesAndFoldersMetadataDataStructureMock
      ).not.toHaveBeenCalled();

      expect(notifyInfoMock).toHaveBeenCalledWith(
        translations.t("workspace.cannotMoveToFile"),
        translations.t("workspace.impossibleMove")
      );
    });
    it("should block an element move if name conflict in target folder", () => {
      const store = mockStore(() => state1);

      void store.dispatch(moveElement(file2Id, rootFolderId));

      expect(
        createFilesAndFoldersMetadataDataStructureMock
      ).not.toHaveBeenCalled();

      expect(notifyInfoMock).toHaveBeenCalledWith(
        translations.t("workspace.nameConflict"),
        translations.t("workspace.impossibleMove")
      );
    });
  });
  describe("updateFilesAndFolderHashes", () => {
    it("should dispatch an update action for each ff", () => {
      const hashes = {
        [updateId1]: newHash1,
        [updateId2]: newHash2,
      };

      const store = mockStore(testState);

      void store.dispatch(updateFilesAndFoldersHashes(hashes));

      const actions = store.getActions();

      expect(actions).toEqual([setFilesAndFoldersHashes(hashes)]);
    });
  });

  describe("updateAliasThunk", () => {
    it("should dispatch the right action", () => {
      const store = mockStore(testState);
      const ffId = "ff-id";
      const alias = "new-alias";
      void store.dispatch(updateAliasThunk(ffId, alias));

      expect(store.getActions()).toEqual([
        setFilesAndFoldersAliases({ [ffId]: alias }),
        commitAction(),
      ]);
    });
  });

  describe("updateCommentThunk", () => {
    it("should dispatch the right action", () => {
      const store = mockStore(testState);
      const ffId = "ff-id";
      const comment = "new-comment";
      void store.dispatch(updateCommentThunk(ffId, comment));

      expect(store.getActions()).toEqual([
        addCommentsOnFilesAndFolders({ [ffId]: comment }),
      ]);
    });
  });

  describe("overrideLastModifiedDateThunk", () => {
    it("should dispatch the right actions", () => {
      const store = mockStore(testState);
      const overrideDate = 20;
      void store.dispatch(
        overrideLastModifiedDateThunk(updateId1, overrideDate)
      );

      const newMetadata = createFilesAndFoldersMetadataDataStructure(
        filesAndFoldersSample,
        {},
        {}
      );

      expect(store.getActions()).toEqual([
        overrideLastModified(updateId1, overrideDate),
        initFilesAndFoldersMetatada(newMetadata),
      ]);
    });
  });
});
