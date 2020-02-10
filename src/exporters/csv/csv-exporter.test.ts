import { promises as fs } from "fs";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { of } from "rxjs";
import { DispatchExts } from "../../reducers/archifiltre-types";
import { createFilesAndFoldersMetadata } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-test-utils";
import { initialState as filesAndFoldersInitialState } from "../../reducers/files-and-folders/files-and-folders-reducer";
import {
  COMPLETE_LOADING,
  LoadingInfoTypes,
  PROGRESS_LOADING,
  START_LOADING
} from "../../reducers/loading-info/loading-info-types";
import { StoreState } from "../../reducers/store";
import {
  createEmptyStore,
  wrapStoreWithUndoable
} from "../../reducers/store-test-utils";
import { promptUserForSave } from "../../util/file-system-util";
import { csvExporterThunk } from "./csv-exporter";
import { generateCsvExport$ } from "./csv-exporter.controller";

jest.mock("./csv-exporter.controller", () => ({
  generateCsvExport$: jest.fn()
}));

jest.mock("uuid/v4", () => () => "test-uuid");

jest.mock("../../util/file-system-util", () => ({
  promptUserForSave: jest.fn(filename =>
    Promise.resolve(`/path/to/${filename}`)
  )
}));

jest.mock("fs", () => ({
  promises: {
    writeFile: jest.fn()
  }
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
  filesAndFolders: wrapStoreWithUndoable({
    ...filesAndFoldersInitialState,
    elementsToDelete: [taggedFfId],
    filesAndFolders,
    hashes
  }),
  filesAndFoldersMetadata: { filesAndFoldersMetadata },
  tags: wrapStoreWithUndoable({ tags })
};

const generateCsvExportMock = generateCsvExport$ as jest.Mock;
const promptUserForSaveMock = promptUserForSave as jest.Mock;
const writeFileMock = fs.writeFile as jest.Mock;
const csvValue = "csv-value";

describe("csv-exporter", () => {
  describe("csvExporterThunk", () => {
    beforeEach(() => {
      writeFileMock.mockReset();
      generateCsvExportMock.mockReset();
      generateCsvExportMock.mockReturnValue(of(undefined, undefined, csvValue));
      writeFileMock.mockResolvedValue(undefined);
    });
    describe("withoutHashes", () => {
      it("should generate valid csv data", async () => {
        const store = mockStore(testState);
        const name = "test-name";
        await store.dispatch(csvExporterThunk(name));

        expect(generateCsvExportMock).toHaveBeenCalledWith({
          elementsToDelete: [taggedFfId],
          filesAndFolders,
          filesAndFoldersMetadata,
          hashes: undefined,
          tags
        });
        expect(writeFileMock).toHaveBeenCalledWith(
          `/path/to/${name}`,
          csvValue,
          {
            encoding: "utf-8"
          }
        );
        expect(store.getActions()).toEqual([
          {
            goal: 2,
            id: "test-uuid",
            label: "Creating the CSV export file",
            loadingType: LoadingInfoTypes.EXPORT,
            type: START_LOADING
          },
          {
            id: "test-uuid",
            progress: 3,
            type: PROGRESS_LOADING
          },
          {
            id: "test-uuid",
            type: COMPLETE_LOADING
          }
        ]);
      });
    });

    describe("withHashes", () => {
      it("should generate valid csv data", async () => {
        const store = mockStore(testState);
        const name = "test-name";
        await store.dispatch(csvExporterThunk(name, { withHashes: true }));

        expect(generateCsvExportMock).toHaveBeenCalledWith({
          elementsToDelete: [taggedFfId],
          filesAndFolders,
          filesAndFoldersMetadata,
          hashes,
          tags
        });

        expect(writeFileMock).toHaveBeenCalledWith(
          `/path/to/${name}`,
          csvValue,
          {
            encoding: "utf-8"
          }
        );

        expect(store.getActions()).toEqual([
          {
            goal: 2,
            id: "test-uuid",
            label: "Creating the CSV export file",
            loadingType: LoadingInfoTypes.EXPORT,
            type: START_LOADING
          },
          {
            id: "test-uuid",
            progress: 3,
            type: PROGRESS_LOADING
          },
          {
            id: "test-uuid",
            type: COMPLETE_LOADING
          }
        ]);
      });
    });

    describe("when user cancels save", () => {
      it("should not do anything", async () => {
        promptUserForSaveMock.mockReset();
        promptUserForSaveMock.mockResolvedValue(undefined);

        const store = mockStore(testState);

        await store.dispatch(csvExporterThunk(name));

        expect(generateCsvExportMock).not.toHaveBeenCalled();
        expect(writeFileMock).not.toHaveBeenCalled();
        expect(store.getActions()).toEqual([]);
      });
    });
  });
});
