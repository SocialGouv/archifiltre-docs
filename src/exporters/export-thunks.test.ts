import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { computeDerived, ff } from "../datastore/files-and-folders";
import { DispatchExts } from "../reducers/archifiltre-types";
import { StoreState } from "../reducers/store";
import {
  createEmptyStore,
  wrapStoreWithUndoable
} from "../reducers/store-test-utils";
import { exportMetsThunk, resipExporterThunk } from "./export-thunks";
import { makeSIP } from "./mets";
import resipExporter from "./resipExporter";

jest.mock("./resipExporter", () => ({
  __esModule: true,
  default: jest.fn()
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

const emptyStore = createEmptyStore();

const storeContent = {
  ...emptyStore,
  tags: wrapStoreWithUndoable({ tags })
};

describe("export-thunks", () => {
  describe("resipExporterThunk", () => {
    it("should call resipExporter with the right data", () => {
      const mockedResipExporter = resipExporter as jest.Mock<any>;

      const store = mockStore(storeContent);

      const csvData = [["data"]];
      mockedResipExporter.mockReturnValue(csvData);
      const returnValue = store.dispatch(resipExporterThunk(filesAndFolders));

      expect(returnValue).toEqual(csvData);
      expect(mockedResipExporter).toHaveBeenCalledWith(filesAndFolders, tags);
    });
  });

  describe("exportMetsThunk", () => {
    it("should call makeSIP with the right data", () => {
      const mockedMakeSIP = makeSIP as jest.Mock<any>;
      const store = mockStore(storeContent);

      const state = {
        files_and_folders: filesAndFolders
      };

      store.dispatch(exportMetsThunk(state));

      expect(mockedMakeSIP).toHaveBeenCalledWith(state, tags);
    });
  });
});
