import { List } from "immutable";
import { keyBy } from "lodash";

import * as RealEstate from "reducers/real-estate";
import * as Origin from "datastore/origin";
import * as VirtualFileSystem from "datastore/virtual-file-system";
import * as FilesAndFolders from "datastore/files-and-folders";
import store from "./store.ts";
import * as tagActions from "./tags/tags-actions.ts";
import * as filesAndFoldersActions from "./files-and-folders/files-and-folders-actions.ts";
import * as filesAndFoldersMetadataActions from "./files-and-folders-metadata/files-and-folders-metadata-actions.ts";
import { getTagsFromStore } from "./tags/tags-selectors";

const property_name = "database";

const initialState = () => VirtualFileSystem.make(Origin.empty());

const rootFfId = () => () => "";

const getFfIdPath = id => () =>
  List(
    id.split("/").map((_, i) =>
      id
        .split("/")
        .slice(0, i + 1)
        .join("/")
    )
  );

const getData = () => state => ({
  files_and_folders: FilesAndFolders.toJs(state.get("files_and_folders")),
  session_name: state.get("session_name"),
  tags: getTagsFromStore(store.getState()),
  original_path: state.get("original_path"),
  version: state.get("version")
});

const toJson = () => state => JSON.stringify(getData()(state));

const getState = () => state => state;

const getSessionName = () => state => state.get("session_name");
const getOriginalPath = () => state => state.get("original_path");

const getWaitingCounter = () => () => 0;

const reader = {
  rootFfId,
  getFfIdPath,
  toJson,
  getSessionName,
  getOriginalPath,
  getWaitingCounter,
  getData,
  getState
};

const set = next_state => () => {
  store.dispatch(tagActions.initializeTags(next_state.tags));

  const formattedFilesAndFolders = Object.entries(
    next_state.files_and_folders
  ).map(([id, ff]) => ({
    ...ff,
    id
  }));

  store.dispatch(
    filesAndFoldersActions.initializeFilesAndFolders(
      keyBy(formattedFilesAndFolders, "id")
    )
  );

  const formattedMetadata = Object.entries(next_state.files_and_folders).map(
    ([id, ff]) => ({
      lastModifiedAverage: ff.last_modified_average,
      childrenTotalSize: ff.size,
      lastModifiedMax: ff.last_modified_max,
      lastModifiedMedian: ff.last_modified_median,
      lastModifiedMin: ff.last_modified_min,
      nbChildrenFiles: ff.nb_files,
      sortBySizeIndex: ff.sort_by_size_index,
      sortByDateIndex: ff.sort_by_date_index,
      id
    })
  );

  store.dispatch(
    filesAndFoldersMetadataActions.initFilesAndFoldersMetatada(
      keyBy(formattedMetadata, "id")
    )
  );

  return VirtualFileSystem.fromJs(next_state);
};

const reInit = () => () => {
  store.dispatch(tagActions.resetTags());
  return initialState();
};

const updateAlias = (updater, id) => state => {
  store.dispatch(filesAndFoldersActions.setFilesAndFoldersAlias(id, updater()));
  return state;
};

const updateComments = (updater, id) => state => {
  store.dispatch(
    filesAndFoldersActions.addCommentsOnFilesAndFolders(id, updater())
  );
  return state;
};

const setSessionName = name => state => state.set("session_name", name);

const writer = {
  set,
  reInit,
  updateAlias,
  updateComments,
  setSessionName
};

export default RealEstate.create({
  property_name,
  initialState,
  reader,
  writer
});
