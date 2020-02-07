import { promises as fs } from "fs";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { from } from "rxjs";
import { DispatchExts } from "../../reducers/archifiltre-types";
import { createFilesAndFoldersMetadata } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-test-utils";
import { initialState as filesAndFoldersInitialState } from "../../reducers/files-and-folders/files-and-folders-reducer";
import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";
import { StoreState } from "../../reducers/store";
import {
  createEmptyStore,
  wrapStoreWithUndoable
} from "../../reducers/store-test-utils";
import { notifyInfo, notifySuccess } from "../../util/notifications-util";
import { generateResipExport$ } from "./resip-export.controller";
import { resipExporterThunk } from "./resip-exporter-thunk";

jest.mock("./resip-export.controller", () => ({
  generateResipExport$: jest.fn()
}));

jest.mock("fs", () => ({
  promises: {
    writeFile: jest.fn()
  }
}));
jest.mock("../../util/notifications-util", () => ({
  notifyInfo: jest.fn(),
  notifySuccess: jest.fn()
}));

const mockStore = configureMockStore<StoreState, DispatchExts>([thunk]);
const tagName = "test-tag-1";
const taggedFfId = "/folder/ff-id";
const tagId = "test-tag-id";
const tags = {
  [tagId]: {
    ffIds: [taggedFfId],
    id: tagId,
    name: tagName
  }
};
const filesAndFolders = {
  "": createFilesAndFolders({ id: "" }),
  id1: createFilesAndFolders({ id: "id1" }),
  id2: createFilesAndFolders({ id: "id2" })
};

const filesAndFoldersMetadata = {
  "": createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 1570615679168,
    medianLastModified: 4000,
    minLastModified: 1000
  }),
  id1: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 1570615679168,
    medianLastModified: 4000,
    minLastModified: 1000
  }),
  id2: createFilesAndFoldersMetadata({
    averageLastModified: 3000,
    childrenTotalSize: 10000,
    maxLastModified: 1570615679168,
    medianLastModified: 4000,
    minLastModified: 1000
  })
};
const emptyStore = createEmptyStore();
const storeContent = {
  ...emptyStore,
  filesAndFolders: wrapStoreWithUndoable({
    ...filesAndFoldersInitialState,
    filesAndFolders
  }),
  filesAndFoldersMetadata: { filesAndFoldersMetadata },
  tags: wrapStoreWithUndoable({ tags })
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
          { count: 100, resipCsv }
        ])
      );
    });

    it("should call resipExporter with the right data", async () => {
      const store = mockStore(storeContent);

      await store.dispatch(resipExporterThunk(savePath));

      expect(mockedGenerateResipExport$).toHaveBeenCalledWith(
        filesAndFolders,
        tags
      );
      expect(writeFileMock).toHaveBeenCalledWith(
        savePath,
        '"resipCsv";"header"'
      );
    });

    it("should open info popin on start", () => {
      const notifyInfoMock = notifyInfo as jest.Mock;
      notifyInfoMock.mockReset();
      const store = mockStore(storeContent);

      store.dispatch(resipExporterThunk(savePath));

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
