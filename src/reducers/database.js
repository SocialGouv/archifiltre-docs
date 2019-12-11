import { keyBy } from "lodash";

import * as RealEstate from "reducers/real-estate";
import * as Origin from "datastore/origin";
import * as VirtualFileSystem from "datastore/virtual-file-system";
import store from "./store.ts";
import * as tagActions from "./tags/tags-actions.ts";
import * as filesAndFoldersActions from "./files-and-folders/files-and-folders-actions.ts";
import * as filesAndFoldersMetadataActions from "./files-and-folders-metadata/files-and-folders-metadata-actions.ts";

const property_name = "database";

const initialState = () => VirtualFileSystem.make(Origin.empty());

const rootFfId = () => () => "";

const getSessionName = () => state => state.get("session_name");
const getOriginalPath = () => state => state.get("original_path");
const getVersion = () => state => state.get("version");

const reader = {
  rootFfId,
  getSessionName,
  getOriginalPath,
  getVersion
};

const set = next_state => state => {
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
      childrenTotalSize: ff.size,
      averageLastModified: ff.last_modified_average,
      maxLastModified: ff.last_modified_max,
      medianLastModified: ff.last_modified_median,
      minLastModified: ff.last_modified_min,
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

  return state.set("original_path", next_state.original_path);
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
const setOriginalPath = path => state => state.set("original_path", path);

const writer = {
  set,
  reInit,
  updateAlias,
  updateComments,
  setSessionName,
  setOriginalPath
};

export default RealEstate.create({
  property_name,
  initialState,
  reader,
  writer
});
