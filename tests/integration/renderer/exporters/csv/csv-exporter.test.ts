import { csvExporterThunk } from "@renderer/exporters/csv/csv-exporter";
import { generateCsvExport$ } from "@renderer/exporters/csv/csv-exporter.controller";
import type { DispatchExts } from "@renderer/reducers/archifiltre-types";
import { initialState as filesAndFoldersInitialState } from "@renderer/reducers/files-and-folders/files-and-folders-reducer";
import { createFilesAndFoldersMetadata } from "@renderer/reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { initialState as hashInitialState } from "@renderer/reducers/hashes/hashes-reducer";
import {
  COMPLETE_LOADING,
  LoadingInfoTypes,
  PROGRESS_LOADING,
  START_LOADING,
} from "@renderer/reducers/loading-info/loading-info-types";
import type { StoreState } from "@renderer/reducers/store";
import { MessageTypes } from "@renderer/utils/batch-process/batch-process-util-types";
import { promises as fs } from "fs";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { of } from "rxjs";

import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";
import {
  createEmptyStore,
  wrapStoreWithUndoable,
} from "../../reducers/store-test-utils";

jest.mock("@renderer/exporters/csv/csv-exporter.controller", () => ({
  generateCsvExport$: jest.fn(),
}));

jest.mock("uuid", () => ({
  v4: () => "test-uuid",
}));

jest.mock("fs", () => ({
  promises: {
    writeFile: jest.fn(),
  },
}));

jest.mock("electron", () => ({
  shell: {
    openExternal: jest.fn(),
  },
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
    name: tagName,
  },
  [tagId2]: {
    ffIds: [taggedFfId],
    id: tagId2,
    name: tag2Name,
  },
};

const filesAndFolders = {
  [rootId]: createFilesAndFolders({
    children: [taggedFfId],
    file_last_modified: 1571325669,
    file_size: 10,
    id: rootId,
    name: "root",
  }),
  [taggedFfId]: createFilesAndFolders({
    children: [],
    file_last_modified: 1571325669,
    file_size: 10,
    id: taggedFfId,
    name: "filename",
  }),
};

const filesAndFoldersMetadata = {
  [taggedFfId]: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 10000,
    medianLastModified: 4000,
    minLastModified: 1000,
  }),
};

const rootHash = "root-tag";
const taggedHash = "tagged-hash";
const hashes = {
  [rootId]: rootHash,
  [taggedFfId]: taggedHash,
};

const rootComment = "root-comment";
const elementComment = "element-comment";
const comments = {
  [rootId]: rootComment,
  [taggedFfId]: elementComment,
};

const rootAlias = "root-alias";
const elementAlias = "element-alias";
const aliases = {
  [rootId]: rootAlias,
  [taggedFfId]: elementAlias,
};

const emptyStore = createEmptyStore();

const testState = {
  ...emptyStore,
  filesAndFolders: wrapStoreWithUndoable({
    ...filesAndFoldersInitialState,
    aliases,
    comments,
    elementsToDelete: [taggedFfId],
    filesAndFolders,
  }),
  filesAndFoldersMetadata: wrapStoreWithUndoable({ filesAndFoldersMetadata }),
  hashes: { ...hashInitialState, hashes },
  tags: wrapStoreWithUndoable({ tags }),
};

const generateCsvExportMock = generateCsvExport$ as jest.Mock;
const writeFileMock = fs.writeFile as jest.Mock;
const csvValue = "csv-value";

const resultMessage = <T>(result: T) => ({
  result,
  type: MessageTypes.RESULT,
});

const errorMessage = () => ({
  type: MessageTypes.ERROR,
});

describe("csv-exporter", () => {
  describe("csvExporterThunk", () => {
    beforeEach(() => {
      writeFileMock.mockReset();
      generateCsvExportMock.mockReset();
      generateCsvExportMock.mockReturnValue(
        of(resultMessage(3), errorMessage(), resultMessage(csvValue))
      );
      writeFileMock.mockResolvedValue(undefined);
    });
    describe("withoutHashes", () => {
      it("should generate valid csv data", async () => {
        const store = mockStore(testState);
        const exportPath = "test-export-path";
        await store.dispatch(csvExporterThunk(exportPath));

        expect(generateCsvExportMock).toHaveBeenCalledWith({
          aliases,
          comments,
          elementsToDelete: [taggedFfId],
          filesAndFolders,
          filesAndFoldersMetadata,
          tags,
        });
        expect(writeFileMock).toHaveBeenCalledWith(exportPath, csvValue, {
          encoding: "utf-8",
        });
        expect(store.getActions()).toEqual([
          {
            goal: 3,
            id: "test-uuid",
            label: "Creating the CSV export file",
            loadedLabel: "CSV export file has been created",
            loadingType: LoadingInfoTypes.EXPORT,
            type: START_LOADING,
          },
          {
            id: "test-uuid",
            progress: 3,
            type: PROGRESS_LOADING,
          },
          {
            id: "test-uuid",
            type: COMPLETE_LOADING,
          },
        ]);
      });
    });

    describe("withHashes", () => {
      it("should generate valid csv data", async () => {
        const store = mockStore(testState);
        const exportPath = "test-export-path";
        await store.dispatch(
          csvExporterThunk(exportPath, { withHashes: true })
        );

        expect(generateCsvExportMock).toHaveBeenCalledWith({
          aliases,
          comments,
          elementsToDelete: [taggedFfId],
          filesAndFolders,
          filesAndFoldersMetadata,
          hashes,
          tags,
        });

        expect(writeFileMock).toHaveBeenCalledWith(exportPath, csvValue, {
          encoding: "utf-8",
        });

        expect(store.getActions()).toEqual([
          {
            goal: 3,
            id: "test-uuid",
            label: "Creating the CSV with hashes export file",
            loadedLabel: "CSV with hashes export file has been created.",
            loadingType: LoadingInfoTypes.EXPORT,
            type: START_LOADING,
          },
          {
            id: "test-uuid",
            progress: 3,
            type: PROGRESS_LOADING,
          },
          {
            id: "test-uuid",
            type: COMPLETE_LOADING,
          },
        ]);
      });
    });
  });
});
