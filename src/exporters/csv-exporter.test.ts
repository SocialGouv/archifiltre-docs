import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { DispatchExts } from "../reducers/archifiltre-types";
import { createFilesAndFoldersMetadata } from "../reducers/files-and-folders-metadata/files-and-folders-metadata-test-utils";
import { StoreState } from "../reducers/store";
import {
  createEmptyStore,
  wrapStoreWithUndoable
} from "../reducers/store-test-utils";
import { save, UTF8 } from "../util/file-sys-util";
import { csvExporterThunk } from "./csv-exporter";

jest.mock("../util/file-sys-util", () => ({
  UTF8: "utf-8",
  save: jest.fn()
}));

const mockStore = configureMockStore<StoreState, DispatchExts>([thunk]);

describe("csv-exporter", () => {
  describe("csvExporterThunk", () => {
    it("should generate valid csv data", () => {
      const tagName = "test-tag-1";
      const taggedFfId = "/folder/ff-id";
      const tagId = "test-tag-id";
      const tagId2 = "test-tag-id-2";
      const rootId = "";
      const tags = {
        [tagId]: {
          ffIds: [taggedFfId],
          id: tagId,
          name: tagName
        },
        [tagId2]: {
          ffIds: [rootId],
          id: tagId2,
          name: rootId
        }
      };

      const filesAndFolders = {
        [rootId]: {
          alias: "",
          children: [],
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

      const emptyStore = createEmptyStore();

      const testState = {
        ...emptyStore,
        filesAndFolders: wrapStoreWithUndoable({ filesAndFolders, hashes: {} }),
        filesAndFoldersMetadata: { filesAndFoldersMetadata },
        tags: wrapStoreWithUndoable({ tags })
      };

      const saveMock = save as jest.Mock<any>;
      saveMock.mockReset();
      const store = mockStore(testState);
      const name = "test-name";
      store.dispatch(csvExporterThunk(name));

      const csvHeader = `"";"path";"path length";"name";"extension";"size (octet)";"last_modified";"new name";"description";"file/folder";"depth"\n`;
      const expectedCsv = `${csvHeader}"";"/folder/ff-id";"13";"filename";"";"10000";"01/01/1970";"";"";"file";"1"\n`;

      expect(saveMock).toHaveBeenCalledWith(name, expectedCsv, {
        format: UTF8
      });
    });
  });
});
