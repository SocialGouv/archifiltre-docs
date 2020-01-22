import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { of } from "rxjs";
import { DispatchExts } from "../../reducers/archifiltre-types";
import { createFilesAndFoldersMetadata } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-test-utils";
import { StoreState } from "../../reducers/store";
import {
  createEmptyStore,
  wrapStoreWithUndoable
} from "../../reducers/store-test-utils";
import { save, UTF8 } from "../../util/file-sys-util";
import { csvExporterThunk } from "./csv-exporter";
import { generateCsvExport$ } from "./csv-exporter.controller";

jest.mock("../../util/file-sys-util", () => ({
  UTF8: "utf-8",
  save: jest.fn()
}));

jest.mock("./csv-exporter.controller", () => ({
  generateCsvExport$: jest.fn()
}));

const mockStore = configureMockStore<StoreState, DispatchExts>([thunk]);

const tagName = "test-tag-1";
const taggedFfId = "/folder/ff-id";
const tagId = "test-tag-id";
const tagId2 = "test-tag-id-2";
const rootId = "";
const tag2Name = "tag2";
const tags = {
  [tagId]: {
    ffIds: [taggedFfId],
    id: tagId,
    name: tagName
  },
  [tagId2]: {
    ffIds: [taggedFfId],
    id: tagId2,
    name: tag2Name
  }
};

const filesAndFolders = {
  [rootId]: {
    alias: "",
    children: [taggedFfId],
    comments: "",
    file_last_modified: 1571325669,
    file_size: 10,
    hash: null,
    id: rootId,
    name: "root"
  },
  [taggedFfId]: {
    alias: "",
    children: [],
    comments: "",
    file_last_modified: 1571325669,
    file_size: 10,
    hash: null,
    id: taggedFfId,
    name: "filename"
  }
};

const filesAndFoldersMetadata = {
  [taggedFfId]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 10000,
    medianLastModified: 4000,
    minLastModified: 1000
  })
};

const rootHash = "root-tag";
const taggedHash = "tagged-hash";
const hashes = {
  [rootId]: rootHash,
  [taggedFfId]: taggedHash
};

const emptyStore = createEmptyStore();

const testState = {
  ...emptyStore,
  filesAndFolders: wrapStoreWithUndoable({ filesAndFolders, hashes }),
  filesAndFoldersMetadata: { filesAndFoldersMetadata },
  tags: wrapStoreWithUndoable({ tags })
};

const saveMock = save as jest.Mock;
const generateCsvExportMock = generateCsvExport$ as jest.Mock;
const csvValue = "csv-value";

describe("csv-exporter", () => {
  describe("csvExporterThunk", () => {
    beforeEach(() => {
      saveMock.mockReset();
      generateCsvExportMock.mockReset();
      generateCsvExportMock.mockReturnValue(of(undefined, undefined, csvValue));
    });
    describe("withoutHashes", () => {
      it("should generate valid csv data", async () => {
        const store = mockStore(testState);
        const name = "test-name";
        await store.dispatch(csvExporterThunk(name));

        expect(generateCsvExportMock).toHaveBeenCalledWith({
          filesAndFolders,
          filesAndFoldersMetadata,
          tags
        });
        expect(saveMock).toHaveBeenCalledWith(name, csvValue, {
          format: UTF8
        });
      });
    });

    describe("withHashes", () => {
      it("should generate valid csv data", async () => {
        const store = mockStore(testState);
        const name = "test-name";
        await store.dispatch(csvExporterThunk(name, { withHashes: true }));

        expect(generateCsvExportMock).toHaveBeenCalledWith({
          filesAndFolders,
          filesAndFoldersMetadata,
          hashes,
          tags
        });
        expect(saveMock).toHaveBeenCalledWith(name, csvValue, {
          format: UTF8
        });
      });
    });
  });
});
