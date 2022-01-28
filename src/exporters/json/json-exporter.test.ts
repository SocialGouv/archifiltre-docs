import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import type { DispatchExts } from "../../reducers/archifiltre-types";
import { initialState as filesAndFoldersInitialState } from "../../reducers/files-and-folders/files-and-folders-reducer";
import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";
import { initialState as hashesReducerInitialState } from "../../reducers/hashes/hashes-reducer";
import type { StoreState } from "../../reducers/store";
import {
  createEmptyStore,
  wrapStoreWithUndoable,
} from "../../reducers/store-test-utils";
import { createTag } from "../../reducers/tags/tags-test-util";
import { save } from "../../util/file-system/file-sys-util";
import { jsonExporterThunk } from "./json-exporter";

jest.mock("util/file-system/file-sys-util", () => ({
  getNameWithExtension: (name, ext) => `${name}.${ext}`,
  save: jest.fn(),
}));

const fileAndFolder1Id = "ff-id-1";
const fileAndFolder1 = createFilesAndFolders({
  id: fileAndFolder1Id,
});

const filesAndFolders = {
  [fileAndFolder1Id]: fileAndFolder1,
};

const elementsToDelete = [fileAndFolder1Id];

const tag1Id = "tag-1-id";
const tag1 = createTag({ id: tag1Id });

const tags = {
  [tag1Id]: tag1,
};

const hashes = {
  [fileAndFolder1Id]: "mock-hash",
};

const aliases = {
  [fileAndFolder1Id]: "test-alias",
};
const comments = {
  [fileAndFolder1Id]: "test-comment",
};
const overrideLastModified = {
  [fileAndFolder1Id]: 10,
};

const mockStore = configureMockStore<StoreState, DispatchExts>([thunk]);
const sessionName = "session-name";
const originalPath = "/original/path";
const jsonFileName = "session-name.json";
const version = 999.99;

describe("json-exporter", () => {
  describe("jsonExporterThunk", () => {
    it("should export the data correctly", () => {
      const store = mockStore({
        ...createEmptyStore(),
        filesAndFolders: wrapStoreWithUndoable({
          ...filesAndFoldersInitialState,
          aliases,
          comments,
          elementsToDelete,
          filesAndFolders,
          overrideLastModified,
        }),
        hashes: {
          ...hashesReducerInitialState,
          hashes,
        },
        tags: wrapStoreWithUndoable({
          tags,
        }),
      });

      void store.dispatch(
        jsonExporterThunk({
          originalPath,
          sessionName,
          version: version as any,
        })
      );

      const expectedSavedData = JSON.stringify({
        aliases,
        comments,
        elementsToDelete,
        filesAndFolders,
        hashes,
        originalPath,
        overrideLastModified,
        sessionName,
        tags,
        version,
      });

      expect(save).toHaveBeenCalledWith(jsonFileName, expectedSavedData);
    });
  });
});
