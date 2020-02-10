/* eslint-disable no-fallthrough */
import { generateRandomString } from "util/random-gen-util";
import { mapValues, pick } from "lodash";
import { createFilesAndFoldersMetadataDataStructure } from "../../files-and-folders-loader/files-and-folders-loader";

export const fromAnyJsonToJs = json => {
  let js = JSON.parse(json);

  const version = js.version;

  switch (version) {
    case 8:
      js = v8JsToV9Js(js);
    case 9:
      js = v9JsToV10Js(js);
    case 10:
      js = v10JsToV11Js(js);
    case 11:
    case 12:
      js = v12JsToV13Js(js);
    case 13:
    case 13.1:
      js = v13JsToV14Js(js);
  }
  return js;
};

const v8JsToV9Js = v8 => {
  const v9 = Object.assign({}, v8);
  v9.version = 9;

  delete v9.content_queue;
  delete v9.tree;
  delete v9.tags;
  delete v9.tags_sizes;
  delete v9.parent_path;

  const mapOldToNewId = {};

  const v8TreeToV9Ffs = tree => {
    const table = tree.table;

    const remakePath = (key, table) => {
      const node = table[key];
      const parent = node.parent;
      if (parent === null) {
        return "";
      } else {
        const name = node.name;
        return remakePath(parent, table) + "/" + name;
      }
    };

    const ans = {};
    for (const key in table) {
      const path = remakePath(key, table);
      mapOldToNewId[key] = path;
      const node = table[key];

      const name = node.name;
      const content = node.content;
      const alias = content.alias;
      const comments = content.comments;

      let file_size = 0;
      let file_last_modified = 0;
      if (node.children.length === 0) {
        file_size = content.size;
        file_last_modified = content.last_modified.max;
      }

      ans[path] = {
        name,
        alias,
        comments,
        file_size,
        file_last_modified,

        children: [],

        size: 0,
        last_modified_max: 0,
        last_modified_list: [],
        last_modified_min: Number.MAX_SAFE_INTEGER,
        last_modified_median: null,
        last_modified_average: null,
        depth: 0,
        nb_files: 0,
        sort_by_size_index: [],
        sort_by_date_index: []
      };
    }

    const computeChildren = key => {
      const node = table[key];
      const children = node.children;
      if (children.length) {
        ans[mapOldToNewId[key]].children = children.map(a => mapOldToNewId[a]);
        children.map(computeChildren);
      }
    };

    computeChildren(tree.root_id);

    return ans;
  };

  v9.files_and_folders = v8TreeToV9Ffs(v8.tree);

  const v8TagsToV9Tags = tags => {
    const ans = {};
    for (const key in tags) {
      ans[generateRandomString(40)] = {
        name: key,
        ff_ids: tags[key].map(a => mapOldToNewId[a])
      };
    }
    return ans;
  };

  v9.tags = v8TagsToV9Tags(v8.tags);

  return v9;
};

export const v9JsToV10Js = v9 => {
  const v10 = Object.assign({}, v9);
  v10.version = 10;

  return v10;
};

export const v10JsToV11Js = v10 => {
  const v11 = Object.assign({}, v10);
  v11.version = 11;

  return v11;
};

export const v12JsToV13Js = v12 => {
  const reformatTag = (id, { ff_ids, name }) => ({
    ffIds: ff_ids,
    id,
    name
  });
  return {
    ...v12,
    version: 13,
    tags: Object.keys(v12.tags).reduce(
      (tagMap, tagId) => ({
        ...tagMap,
        [tagId]: reformatTag(tagId, v12.tags[tagId])
      }),
      {}
    )
  };
};

export const v13JsToV14Js = v13 => {
  const filesAndFolders = mapValues(
    v13.files_and_folders,
    (fileAndFolders, id) => ({
      ...pick(fileAndFolders, [
        "name",
        "alias",
        "comments",
        "children",
        "file_size",
        "file_last_modified"
      ]),
      id
    })
  );

  const filesAndFoldersMetadata = createFilesAndFoldersMetadataDataStructure(
    filesAndFolders
  );

  return {
    version: 14,
    filesAndFolders,
    filesAndFoldersMetadata,
    tags: v13.tags,
    sessionName: v13.session_name,
    originalPath: v13.original_path
  };
};
