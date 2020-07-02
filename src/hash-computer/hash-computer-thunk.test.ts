import path from "path";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { of } from "rxjs";
import { DispatchExts } from "reducers/archifiltre-types";
import { initialState as filesAndFoldersInitialState } from "reducers/files-and-folders/files-and-folders-reducer";
import { createFilesAndFolders } from "reducers/files-and-folders/files-and-folders-test-utils";
import {
  completeLoadingAction,
  progressLoadingAction,
} from "reducers/loading-info/loading-info-actions";
import { LoadingInfoTypes } from "reducers/loading-info/loading-info-types";
import { StoreState } from "reducers/store";
import {
  createEmptyStore,
  wrapStoreWithUndoable,
} from "reducers/store-test-utils";
import { computeHashesThunk } from "./hash-computer-thunk";
import {
  computeFolderHashes$,
  computeHashes$,
} from "./hash-computer.controller";
import { setFilesAndFoldersHashes } from "reducers/hashes/hashes-actions";

jest.mock("./hash-computer.controller", () => ({
  computeFolderHashes$: jest.fn(),
  computeHashes$: jest.fn(),
}));

jest.mock("../reducers/files-and-folders/files-and-folders-actions", () => ({
  setFilesAndFoldersHashes: (savedHashes) => ({
    hashes: savedHashes,
    type: "SET_FF_HASHES",
  }),
}));

jest.mock("../reducers/loading-info/loading-info-operations", () => ({
  startLoading: (type, goal, label) => (dispatch) => {
    dispatch({ type: "start-loading", loadingType: type, goal, label });
    return "fake-id";
  },
}));

jest.mock("../translations/translations", () => ({
  __esModule: true,
  default: { t: () => "default-name" },
}));

const originalPath = path.join("root", "path", "folder");
const expectedBasePath = path.join("root", "path");

const mockStore = configureMockStore<StoreState, DispatchExts>([thunk]);

const ffId1 = "ff-id-1";
const ff1 = createFilesAndFolders({ id: ffId1 });
const filesAndFolders = {
  [ffId1]: ff1,
};

const fileHashes = {
  [ffId1]: "hash-1",
};

const folderHashes = {
  "folder-id": "folder-hash",
};

const testStore = mockStore({
  ...createEmptyStore(),
  filesAndFolders: wrapStoreWithUndoable({
    ...filesAndFoldersInitialState,
    filesAndFolders,
  }),
  hashes: { hashes: fileHashes },
});

describe("computeHashesThunk", () => {
  it("should compute hashes and save them", async () => {
    const computeHashes$Mock = computeHashes$ as jest.Mock;
    const computeFolderHashes$Mock = computeFolderHashes$ as jest.Mock;
    computeHashes$Mock.mockImplementation(() =>
      of({ type: "result", result: fileHashes })
    );
    computeFolderHashes$Mock.mockImplementation(() => of(folderHashes));
    await testStore.dispatch(computeHashesThunk(originalPath));
    expect(computeHashes$).toHaveBeenCalledWith([ffId1], {
      initialValues: { basePath: expectedBasePath },
    });

    expect(computeFolderHashes$).toHaveBeenCalledWith({
      filesAndFolders,
      hashes: fileHashes,
    });

    expect(testStore.getActions()).toEqual([
      {
        goal: 1,
        label: "default-name",
        loadingType: LoadingInfoTypes.HASH_COMPUTING,
        type: "start-loading",
      },
      progressLoadingAction("fake-id", 1),
      setFilesAndFoldersHashes(fileHashes),
      progressLoadingAction("fake-id", 1),
      setFilesAndFoldersHashes(folderHashes),
      completeLoadingAction("fake-id"),
    ]);
  });
});
