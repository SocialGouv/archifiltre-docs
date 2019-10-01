import { updateIn, getIn, List, Set } from "immutable";

import * as RealEstate from "reducers/real-estate";

import * as Origin from "datastore/origin";
import * as VirtualFileSystem from "datastore/virtual-file-system";
import * as Tags from "datastore/tags";
import * as FilesAndFolders from "datastore/files-and-folders";

import * as SEDA from "seda";
import * as METS from "mets";

import store from "./store.ts";
import * as actions from "./tags/tags-actions.ts";
import uuid from "uuid/v4";

const property_name = "database";

const initialState = () => VirtualFileSystem.make(Origin.empty());

const overallCount = () => state => state.get("files_and_folders").size;

const fileCount = () => state =>
  state.get("files_and_folders").filter(a => a.get("children").size === 0).size;

const getFfByFfId = id => state => state.get("files_and_folders").get(id);
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

const toJson = () => state => JSON.stringify(VirtualFileSystem.toJs(state));

const getData = () => state => VirtualFileSystem.toJs(state);

/**
 * Generates an array of array ([[]]) with the first line being
 * the csv header.
 *
 * Each line represents one file or folder.
 *
 * ff_id_list is an array that determined the line order.
 */
const toStrList2 = () => state => {
  const files_and_folders = state.get("files_and_folders");
  const root_id = "";
  const ff_id_list = FilesAndFolders.toFfidList(files_and_folders).filter(
    a => a !== root_id
  );
  const tags = state.get("tags");

  const ans = FilesAndFolders.toStrList2(ff_id_list, files_and_folders);

  Tags.toStrList2(ff_id_list, files_and_folders, tags).forEach((a, i) => {
    ans[i] = ans[i].concat(a);
  });

  return ans;
};

const toSIP = () => SEDA.makeSIP;
const toSIP2 = () => METS.makeSIP;

const getSessionName = () => state => state.get("session_name");
const getOriginalPath = () => state => state.get("original_path");

const getTagIdsByFfId = id => state =>
  state
    .get("tags")
    .filter(tag => tag.get("ff_ids").includes(id))
    .keySeq()
    .toList();
const getAllTagIds = () => state =>
  state
    .get("tags")
    .keySeq()
    .toList();

const getTagByTagId = id => state => getIn(state, ["tags", id]);

const getWaitingCounter = () => () => 0;

/**
 * Returns the current databaseState. Used for selectors purpose.
 * @returns {function(*): *}
 */
const getState = () => state => state;

const reader = {
  overallCount,
  fileCount,
  getFfByFfId,
  rootFfId,
  maxDepth,
  volume,
  getFfIdPath,
  toJson,
  toStrList2,
  toSIP,
  toSIP2,
  getSessionName,
  getOriginalPath,
  getTagIdsByFfId,
  getAllTagIds,
  getTagByTagId,
  getWaitingCounter,
  getData,
  getState
};

const set = next_state => () => next_state;

const reInit = () => () => initialState();

const updateAlias = (updater, id) => state => {
  state = updateIn(state, ["files_and_folders", id, "alias"], updater);
  return state;
};

const updateComments = (updater, id) => state => {
  state = updateIn(state, ["files_and_folders", id, "comments"], updater);
  return state;
};

const setSessionName = name => state => state.set("session_name", name);

const createTagged = (ff_id, name) => state => {
  const id = uuid();
  state = state.update("tags", a => {
    return Tags.push(Tags.create({ name, ff_ids: Set.of(ff_id) }), a, { id });
  });
  state = VirtualFileSystem.derivateTags(state);
  store.dispatch(actions.addTag(name, ff_id, id));
  return state;
};

const addTagged = (ff_id, tag_id) => state => {
  state = updateIn(state, ["tags", tag_id, "ff_ids"], a => a.add(ff_id));
  state = VirtualFileSystem.derivateTags(state);
  store.dispatch(actions.tagFile(tag_id, ff_id));
  return state;
};

const deleteTagged = (ff_id, tag_id) => state => {
  state = updateIn(state, ["tags", tag_id, "ff_ids"], a => a.delete(ff_id));
  state = VirtualFileSystem.derivateTags(state);
  store.dispatch(actions.untagFile(tag_id, ff_id));
  return state;
};

const renameTag = (name, tag_id) => state => {
  state = updateIn(state, ["tags", tag_id, "name"], () => name);
  state = VirtualFileSystem.derivateTags(state);
  store.dispatch(actions.renameTag(tag_id, name));
  return state;
};

const deleteTag = tag_id => state => {
  state = state.update("tags", tags => tags.delete(tag_id));
  store.dispatch(actions.deleteTag(tag_id));
  return state;
};

const setHashes = hashesMap => state =>
  Object.keys(hashesMap).reduce(
    (acc, ffId) =>
      updateIn(acc, ["files_and_folders", ffId, "hash"], () => hashesMap[ffId]),
    state
  );

const writer = {
  set,
  reInit,
  updateAlias,
  updateComments,
  setSessionName,
  createTagged,
  addTagged,
  deleteTagged,
  renameTag,
  deleteTag,
  setHashes
};

export default RealEstate.create({
  property_name,
  initialState,
  reader,
  writer
});
