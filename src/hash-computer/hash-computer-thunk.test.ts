import path from "path";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { from as observableFrom } from "rxjs";
import { DispatchExts } from "../reducers/archifiltre-types";
import { setFilesAndFoldersHashes } from "../reducers/files-and-folders/files-and-folders-actions";
import { createFilesAndFolders } from "../reducers/files-and-folders/files-and-folders-test-utils";
import { StoreState } from "../reducers/store";
import {
  createEmptyStore,
  wrapStoreWithUndoable
} from "../reducers/store-test-utils";
import { computeHashesThunk } from "./hash-computer-thunk";
import {
  computeFolderHashes$,
  computeHashes$
} from "./hash-computer.controller";

jest.mock("./hash-computer.controller", () => ({
  computeFolderHashes$: jest.fn(),
  computeHashes$: jest.fn()
}));

jest.mock("../reducers/files-and-folders/files-and-folders-actions", () => ({
  setFilesAndFoldersHashes: savedHashes => ({
    hashes: savedHashes,
    type: "SET_FF_HASHES"
  })
}));

const originalPath = path.join("root", "path", "folder");
const expectedBasePath = path.join("root", "path");

const mockStore = configureMockStore<StoreState, DispatchExts>([thunk]);

const ffId1 = "ff-id-1";
const ff1 = createFilesAndFolders({ id: ffId1 });
const filesAndFolders = {
  [ffId1]: ff1
};

const fileHashes = {
  [ffId1]: "hash-1"
};

const folderHashes = {
  "folder-id": "folder-hash"
};

const testStore = mockStore({
  ...createEmptyStore(),
  filesAndFolders: wrapStoreWithUndoable({
    filesAndFolders,
    hashes: fileHashes
  })
});

describe("computeHashesThunk", () => {
  it("should compute hashes and save them", async () => {
    const computeHashes$Mock = computeHashes$ as jest.Mock;
    const computeFolderHashes$Mock = computeFolderHashes$ as jest.Mock;
    computeHashes$Mock.mockImplementation(() => observableFrom([fileHashes]));
    computeFolderHashes$Mock.mockImplementation(() =>
      observableFrom([folderHashes])
    );
    await testStore.dispatch(computeHashesThunk(originalPath));
    expect(computeHashes$).toHaveBeenCalledWith([ffId1], {
      initialValues: { basePath: expectedBasePath }
    });

    expect(computeFolderHashes$).toHaveBeenCalledWith({
      filesAndFolders,
      hashes: fileHashes
    });

    expect(testStore.getActions()).toEqual([
      setFilesAndFoldersHashes(fileHashes),
      setFilesAndFoldersHashes(folderHashes)
    ]);
  });
});
