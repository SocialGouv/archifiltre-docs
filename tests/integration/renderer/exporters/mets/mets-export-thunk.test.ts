import { metsExporterThunk } from "@renderer/exporters/mets/mets-export-thunk";
import type { DispatchExts } from "@renderer/reducers/archifiltre-types";
import { initialState as filesAndFoldersInitialState } from "@renderer/reducers/files-and-folders/files-and-folders-reducer";
import { createFilesAndFoldersMetadata } from "@renderer/reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import type { StoreState } from "@renderer/reducers/store";
import { initialState as workspaceMetadataInitialState } from "@renderer/reducers/workspace-metadata/workspace-metadata-reducer";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";
import {
  createEmptyStore,
  wrapStoreWithUndoable,
} from "../../reducers/store-test-utils";

jest.mock("@renderer/exporters/mets/mets", () => ({
  makeSIP: jest.fn(),
}));

const tagName = "test-tag-1";
const taggedFfId = "/folder/ff-id";
const tagId = "test-tag-id";

const tags = {
  [tagId]: {
    ffIds: [taggedFfId],
    id: tagId,
    name: tagName,
  },
};

const filesAndFolders = {
  "": createFilesAndFolders({ id: "" }),
  id1: createFilesAndFolders({ id: "id1" }),
  id2: createFilesAndFolders({ id: "id2" }),
};

const comments = {
  id1: "comment",
};

const aliases = {
  id2: "alias",
};

const filesAndFoldersMetadata = {
  "": createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 1570615679168,
    medianLastModified: 4000,
    minLastModified: 1000,
  }),
  id1: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 1570615679168,
    medianLastModified: 4000,
    minLastModified: 1000,
  }),
  id2: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 1570615679168,
    medianLastModified: 4000,
    minLastModified: 1000,
  }),
};

const workspaceMetadata = {
  ...workspaceMetadataInitialState,
  originalPath: "test-original-path",
  sessionName: "test-session-name",
};

const elementsToDelete = ["deleted-ffid"];

const mockStore = configureMockStore<StoreState, DispatchExts>([thunk]);

const emptyStore = createEmptyStore();

const storeContent: StoreState = {
  ...emptyStore,
  filesAndFolders: wrapStoreWithUndoable({
    ...filesAndFoldersInitialState,
    aliases,
    comments,
    elementsToDelete,
    filesAndFolders,
  }),
  filesAndFoldersMetadata: wrapStoreWithUndoable({ filesAndFoldersMetadata }),
  tags: wrapStoreWithUndoable({ tags }),
  workspaceMetadata: wrapStoreWithUndoable(workspaceMetadata),
};

describe.skip("mets-export-thunk", () => {
  describe("metsExporterThunk", () => {
    it("should call makeSIP with the right data", () => {
      const mockedMakeSIP = jest.fn(); // makeSIP;
      const store = mockStore(storeContent);

      const exportPath = "test-export-path";

      void store.dispatch(metsExporterThunk(exportPath));

      expect(mockedMakeSIP).toHaveBeenCalledWith({
        aliases,
        comments,
        elementsToDelete,
        exportPath,
        filesAndFolders,
        filesAndFoldersMetadata,
        originalPath: workspaceMetadata.originalPath,
        sessionName: workspaceMetadata.sessionName,
        tags,
      });
    });
  });
});
