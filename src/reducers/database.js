import { updateIn, List } from "immutable";

import * as RealEstate from "reducers/real-estate";

import * as Origin from "datastore/origin";
import * as VirtualFileSystem from "datastore/virtual-file-system";
import * as FilesAndFolders from "datastore/files-and-folders";

import * as METS from "exporters/mets";

import store from "./store.ts";
import * as tagActions from "./tags/tags-actions.ts";
import * as filesAndFoldersActions from "./files-and-folders/files-and-folders-actions.ts";
import * as filesAndFoldersMetadataActions from "./files-and-folders-metadata/files-and-folders-metadata-actions.ts";
import { getTagsFromStore } from "./tags/tags-selectors";
import { updateFilesAndFolderHashes } from "./files-and-folders/files-and-folders-thunks";

const property_name = "database";

const initialState = () => VirtualFileSystem.make(Origin.empty());

const overallCount = () => state => state.get("files_and_folders").size;

const fileCount = () => state =>
  state.get("files_and_folders").filter(a => a.get("children").size === 0).size;

const getFfByFfId = id => state => state.get("files_and_folders").get(id);

const getFilesAndFolders = () => state => state.get("files_and_folders");

const rootFfId = () => () => "";

const maxDepth = () => state =>
  state
    .get("files_and_folders")
    .map(a => a.get("depth"))
    .reduce((acc, val) => Math.max(acc, val), 0);

const volume = () => state => getFfByFfId(rootFfId()())(state).get("size");

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

const toMETS = () => state => {
  const tags = getTagsFromStore(store.getState());
  return METS.makeSIP(state, tags);
};

const getSessionName = () => state => state.get("session_name");
const getOriginalPath = () => state => state.get("original_path");

const getWaitingCounter = () => () => 0;

const reader = {
  overallCount,
  fileCount,
  getFfByFfId,
  rootFfId,
  maxDepth,
  volume,
  getFfIdPath,
  toJson,
  toMETS,
  getSessionName,
  getOriginalPath,
  getWaitingCounter,
  getData,
  getFilesAndFolders,
  getState
};

const set = next_state => () => {
  store.dispatch(tagActions.initializeTags(next_state.tags));
  store.dispatch(
    filesAndFoldersActions.initializeFilesAndFolders(
      Object.entries(next_state.files_and_folders).reduce(
        (ffMap, [id, ff]) => ({
          ...ffMap,
          [id]: {
            ...ff,
            id
          }
        }),
        {}
      )
    )
  );
  const metadata = Object.entries(next_state.files_and_folders).reduce(
    (metadataMap, [id, ff]) => ({
      ...metadataMap,
      [id]: {
        lastModifiedAverage: ff.last_modified_average,
        childrenTotalSize: ff.size,
        lastModifiedMax: ff.last_modified_max,
        lastModifiedMedian: ff.last_modified_median,
        lastModifiedMin: ff.last_modified_min
      }
    }),
    {}
  );

  store.dispatch(
    filesAndFoldersMetadataActions.initFilesAndFoldersMetatada(metadata)
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

const setHashes = hashesMap => state => {
  store.dispatch(updateFilesAndFolderHashes(hashesMap));

  return Object.keys(hashesMap).reduce(
    (acc, ffId) =>
      updateIn(acc, ["files_and_folders", ffId, "hash"], () => hashesMap[ffId]),
    state
  );
};

const writer = {
  set,
  reInit,
  updateAlias,
  updateComments,
  setSessionName,
  setHashes
};

export default RealEstate.create({
  property_name,
  initialState,
  reader,
  writer
});
