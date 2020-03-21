import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { DispatchExts } from "../../reducers/archifiltre-types";
import { createFilesAndFoldersMetadata } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-test-utils";
import { initialState as filesAndFoldersInitialState } from "../../reducers/files-and-folders/files-and-folders-reducer";
import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";
import { StoreState } from "../../reducers/store";
import {
  createEmptyStore,
  wrapStoreWithUndoable,
} from "../../reducers/store-test-utils";
import { makeSIP } from "./mets";
import { metsExporterThunk } from "./mets-export-thunk";

jest.mock("./mets", () => ({
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
  filesAndFoldersMetadata: { filesAndFoldersMetadata },
  tags: wrapStoreWithUndoable({ tags }),
};

describe("mets-export-thunk", () => {
  describe("metsExporterThunk", () => {
    it("should call makeSIP with the right data", () => {
      const mockedMakeSIP = makeSIP as jest.Mock;
      const store = mockStore(storeContent);

      const originalPath = "original-path";
      const sessionName = "session-name";

      store.dispatch(
        metsExporterThunk({
          originalPath,
          sessionName,
        })
      );

      expect(mockedMakeSIP).toHaveBeenCalledWith({
        aliases,
        comments,
        elementsToDelete,
        filesAndFolders,
        filesAndFoldersMetadata,
        originalPath,
        sessionName,
        tags,
      });
    });
  });
});
