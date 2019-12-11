import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { DispatchExts } from "../../reducers/archifiltre-types";
import { createFilesAndFoldersMetadata } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-test-utils";
import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";
import { StoreState } from "../../reducers/store";
import { wrapStoreWithUndoable } from "../../reducers/store-test-utils";
import { createTag } from "../../reducers/tags/tags-test-util";
import { save } from "../../util/file-sys-util";
import { jsonExporterThunk } from "./json-exporter";

jest.mock("../../util/file-sys-util", () => ({
  makeNameWithExt: (name, ext) => `${name}.${ext}`,
  save: jest.fn()
}));

const fileAndFolder1Id = "ff-id-1";
const fileAndFolder1 = createFilesAndFolders({
  id: fileAndFolder1Id
});

const filesAndFolders = {
  [fileAndFolder1Id]: fileAndFolder1
};

const fileAndFolderMetadata1 = createFilesAndFoldersMetadata({});

const filesAndFoldersMetadata = {
  [fileAndFolder1Id]: fileAndFolderMetadata1
};

const tag1Id = "tag-1-id";
const tag1 = createTag({ id: tag1Id });

const tags = {
  [tag1Id]: tag1
};

const hashes = {
  [fileAndFolder1Id]: "mock-hash"
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
        filesAndFolders: wrapStoreWithUndoable({
          filesAndFolders,
          hashes
        }),
        filesAndFoldersMetadata: {
          filesAndFoldersMetadata
        },
        tags: wrapStoreWithUndoable({
          tags
        })
      });

      store.dispatch(
        jsonExporterThunk({
          originalPath,
          sessionName,
          version
        })
      );

      const expectedSavedData = JSON.stringify({
        filesAndFolders,
        filesAndFoldersMetadata,
        hashes,
        originalPath,
        sessionName,
        tags,
        version
      });

      expect(save).toHaveBeenCalledWith(jsonFileName, expectedSavedData);
    });
  });
});
