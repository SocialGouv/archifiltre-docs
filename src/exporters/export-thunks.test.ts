import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { computeDerived, ff } from "../datastore/files-and-folders";
import { DispatchExts } from "../reducers/archifiltre-types";
import { createFilesAndFolders } from "../reducers/files-and-folders/files-and-folders-test-utils";
import { StoreState } from "../reducers/store";
import {
  createEmptyStore,
  wrapStoreWithUndoable
} from "../reducers/store-test-utils";
import { save } from "../util/file-sys-util";
import { csvExporterThunk } from "./csv-exporter";
import { metsExporterThunk, resipExporterThunk } from "./export-thunks";
import { makeSIP } from "./mets";
import resipExporter from "./resipExporter";

jest.mock("./resipExporter", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../util/file-sys-util", () => ({
  save: jest.fn()
}));

jest.mock("./mets", () => ({
  makeSIP: jest.fn()
}));

const mockStore = configureMockStore<StoreState, DispatchExts>([thunk]);

const tagName = "test-tag-1";
const taggedFfId = "/folder/ff-id";
const untaggedFfId = "/folder/ff-id-2";
const tagId = "test-tag-id";
const lastModified = 1570542691716;

const tags = {
  [tagId]: {
    ffIds: [taggedFfId],
    id: tagId,
    name: tagName
  }
};

const origins = [
  [{ size: 10, lastModified }, taggedFfId],
  [{ size: 20, lastModified }, untaggedFfId]
];

const filesAndFolders = computeDerived(ff(origins));
const storeFilesAndFolders = {
  "": createFilesAndFolders({ id: "" }),
  id1: createFilesAndFolders({ id: "id1" }),
  id2: createFilesAndFolders({ id: "id2" })
};

const filesAndFoldersMetadata = {
  "": {
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 1570615679168,
    medianLastModified: 4000,
    minLastModified: 1000
  },
  id1: {
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 1570615679168,
    medianLastModified: 4000,
    minLastModified: 1000
  },
  id2: {
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 1570615679168,
    medianLastModified: 4000,
    minLastModified: 1000
  }
};

const emptyStore = createEmptyStore();

const storeContent = {
  ...emptyStore,
  filesAndFolders: wrapStoreWithUndoable({
    filesAndFolders: storeFilesAndFolders
  }),
  filesAndFoldersMetadata: { filesAndFoldersMetadata },
  tags: wrapStoreWithUndoable({ tags })
};

describe("export-thunks", () => {
  describe("resipExporterThunk", () => {
    it("should call resipExporter with the right data", () => {
      const saveMock = save as jest.Mock<any>;
      const mockedResipExporter = resipExporter as jest.Mock<any>;
      const name = "test-name";
      saveMock.mockReset();
      const store = mockStore(storeContent);

      const csvData = [["data"]];
      mockedResipExporter.mockReturnValue(csvData);
      store.dispatch(resipExporterThunk(name));

      expect(mockedResipExporter).toHaveBeenCalledWith(
        storeFilesAndFolders,
        tags
      );
      expect(saveMock).toHaveBeenCalledWith(name, `"data"\n`);
    });
  });

  describe("metsExporterThunk", () => {
    it("should call makeSIP with the right data", () => {
      const mockedMakeSIP = makeSIP as jest.Mock<any>;
      const store = mockStore(storeContent);

      const state = {
        files_and_folders: filesAndFolders
      };

      store.dispatch(metsExporterThunk(state));

      expect(mockedMakeSIP).toHaveBeenCalledWith(state, tags);
    });
  });
});
