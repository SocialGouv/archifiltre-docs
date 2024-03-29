import { generateResipExport$ } from "@renderer/exporters/resip/resip-export.controller";
import { resipExporterThunk } from "@renderer/exporters/resip/resip-exporter-thunk";
import type { DispatchExts } from "@renderer/reducers/archifiltre-types";
import { initialState as filesAndFoldersInitialState } from "@renderer/reducers/files-and-folders/files-and-folders-reducer";
import { createFilesAndFoldersMetadata } from "@renderer/reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import type { StoreState } from "@renderer/reducers/store";
import { notifyInfo, notifySuccess } from "@renderer/utils/notifications";
import { promises as fs } from "fs";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { from } from "rxjs";

import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";
import {
  createEmptyStore,
  wrapStoreWithUndoable,
} from "../../reducers/store-test-utils";

jest.mock("@renderer/exporters/resip/resip-export.controller", () => ({
  generateResipExport$: jest.fn(),
}));

jest.mock("fs", () => ({
  promises: {
    writeFile: jest.fn(),
  },
}));
jest.mock("@renderer/utils/notifications", () => ({
  notifyInfo: jest.fn(),
  notifySuccess: jest.fn(),
}));

const mockStore = configureMockStore<StoreState, DispatchExts>([thunk]);
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

const aliases = {
  id1: "alias",
};

const comments = {
  id2: "comments",
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

const elementsToDelete = ["ff-id-to-delete"];
const emptyStore = createEmptyStore();
const storeContent = {
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
};

describe("resip-exporter-thunk", () => {
  describe("resipExporterThunk", () => {
    const writeFileMock = fs.writeFile as jest.Mock;
    const mockedGenerateResipExport$ = generateResipExport$ as jest.Mock;
    const savePath = "/path/to/save/the/file";
    const resipCsv = [["resipCsv", "header"]];

    beforeEach(() => {
      mockedGenerateResipExport$.mockReset();
      writeFileMock.mockReset();
      writeFileMock.mockResolvedValue(null);
      mockedGenerateResipExport$.mockReturnValue(
        from([
          { count: 0, result: [] },
          { count: 100, resipCsv },
        ])
      );
    });

    it("should call resipExporter with the right data", async () => {
      const store = mockStore(storeContent);

      await store.dispatch(resipExporterThunk(savePath));

      expect(mockedGenerateResipExport$).toHaveBeenCalledWith({
        activeSedaFields: {
          fields: new Set(),
          tags: new Set(),
        },
        aliases,
        comments,
        elementsToDelete,
        filesAndFolders,
        filesAndFoldersMetadata,
        sedaMetadata: {},
        tags,
      });
      expect(writeFileMock).toHaveBeenCalledWith(
        savePath,
        '"resipCsv";"header"'
      );
    });

    it("should open info popin on start", () => {
      const notifyInfoMock = notifyInfo as jest.Mock;
      notifyInfoMock.mockReset();
      const store = mockStore(storeContent);

      void store.dispatch(resipExporterThunk(savePath));

      expect(notifyInfoMock).toHaveBeenCalled();
    });

    it("should open success popin on success", async () => {
      const notifySuccessMock = notifySuccess as jest.Mock;
      notifySuccessMock.mockReset();
      const store = mockStore(storeContent);

      await store.dispatch(resipExporterThunk(savePath));

      expect(notifySuccessMock).toHaveBeenCalled();
    });
  });
});
