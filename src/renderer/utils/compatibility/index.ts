/*
    eslint-disable
    @typescript-eslint/no-explicit-any
*/
import { generateSecureRandomString } from "@common/utils/generateSecureRandomString";
import { type SimpleObject } from "@common/utils/object";
import _, { mapValues, pick } from "lodash";
import fp from "lodash/fp";

import { createFilesAndFoldersMetadataDataStructure } from "../../files-and-folders-loader/file-system-loading-process-utils";
import { type JsonFileInfo } from "../../files-and-folders-loader/files-and-folders-loader-types";

interface V8 {
  content_queue: any;
  parent_path: any;
  tags: any;
  tags_sizes: any;
  tree: any;
  version: number;
}

interface V9To12 {
  files_and_folders: any;
  tags: any;
}

interface V13 {
  original_path: string;
  session_name: string;
  tags: any;
}

interface V21 {
  filesAndFolders: any;
}

export const convertJsonToCurrentVersion = (json: string): JsonFileInfo => {
  const jsonFileInfo = JSON.parse(json);

  switch (jsonFileInfo.version) {
    case 8:
      return v8JsToV9Js(jsonFileInfo) as JsonFileInfo;
    case 9:
      return v9JsToV10Js(jsonFileInfo) as JsonFileInfo;
    case 10:
      return v10JsToV11Js(jsonFileInfo) as JsonFileInfo;
    case 11:
    case 12:
      return v12JsToV13Js(jsonFileInfo) as JsonFileInfo;
    case 13:
    case 13.1:
      return v13JsToV14Js(jsonFileInfo) as JsonFileInfo;
    case "2.0.0":
      return v2ToV21Js(jsonFileInfo) as JsonFileInfo;
    case "2.1.0":
      return v21ToV22Js(jsonFileInfo) as JsonFileInfo;
    default:
      return jsonFileInfo;
  }
};

const v8JsToV9Js = (v8: V8 & V9To12): SimpleObject => {
  const v9 = { ...v8 };
  v9.version = 9;

  delete v9.content_queue;
  delete v9.tree;
  delete v9.tags;
  delete v9.tags_sizes;
  delete v9.parent_path;

  const mapOldToNewId = {} as any;

  const v8TreeToV9Ffs = (tree: any) => {
    const treeTable = tree.table;

    const remakePath = (key: string, table: any): any => {
      const node = table[key];
      const parent = node.parent;
      if (parent === null) {
        return "";
      } else {
        const name = node.name;
        return `${remakePath(parent, table)}/${name}`;
      }
    };

    const ans = {} as any;
    for (const key in treeTable) {
      if (Object.prototype.hasOwnProperty.call(treeTable, key)) {
        const path = remakePath(key, treeTable);
        mapOldToNewId[key] = path;
        const node = treeTable[key];

        const name = node.name;
        const content = node.content;
        const alias = content.alias;
        const comments = content.comments;

        let fileSize = 0;
        let fileLastModified = 0;
        if (node.children.length === 0) {
          fileSize = content.size;
          fileLastModified = content.last_modified.max;
        }

        ans[path] = {
          alias,
          children: [],
          comments,
          depth: 0,
          file_last_modified: fileLastModified,

          file_size: fileSize,

          last_modified_average: null,
          last_modified_list: [],
          last_modified_max: 0,
          last_modified_median: null,
          last_modified_min: Number.MAX_SAFE_INTEGER,
          name,
          nb_files: 0,
          size: 0,
          sort_by_date_index: [],
          sort_by_size_index: [],
        };
      }
    }

    const computeChildren = (key: string) => {
      const node = treeTable[key];
      const children = node.children;
      if (children.length) {
        ans[mapOldToNewId[key]].children = children.map((a: any) => mapOldToNewId[a]);
        children.map(computeChildren);
      }
    };

    computeChildren(tree.root_id);

    return ans;
  };

  v9.files_and_folders = v8TreeToV9Ffs(v8.tree);

  const v8TagsToV9Tags = (tags: any) => {
    const ans = {} as any;
    for (const key in tags) {
      if (Object.prototype.hasOwnProperty.call(tags, key)) {
        ans[generateSecureRandomString(40)] = {
          ff_ids: tags[key].map((a: any) => mapOldToNewId[a]),
          name: key,
        };
      }
    }
    return ans;
  };

  v9.tags = v8TagsToV9Tags(v8.tags);

  return v9;
};

export const v9JsToV10Js = (v9: V8 & V9To12): SimpleObject => {
  const v10 = { ...v9 };
  v10.version = 10;

  return v10;
};

export const v10JsToV11Js = (v10: V8 & V9To12): SimpleObject => {
  const v11 = { ...v10 };
  v11.version = 11;

  return v11;
};

export const v12JsToV13Js = (v12: V8 & V9To12): SimpleObject => {
  const reformatTag = (id: string, { ff_ids, name }: any) => ({
    ffIds: ff_ids,
    id,
    name,
  });
  return {
    ...v12,
    tags: Object.keys(v12.tags).reduce(
      (tagMap, tagId) => ({
        ...tagMap,
        [tagId]: reformatTag(tagId, v12.tags[tagId]),
      }),
      {},
    ),
    version: 13,
  };
};

export const v13JsToV14Js = (v13: V9To12 & V13): SimpleObject => {
  const filesAndFolders = mapValues(v13.files_and_folders, (fileAndFolders, id) => ({
    ...pick(fileAndFolders, [
      "name",
      "alias",
      "comments",
      "children",
      "file_size",
      "file_last_modified",
      "virtualPath",
    ]),
    id,
  }));

  const filesAndFoldersMetadata = _.mapValues(
    createFilesAndFoldersMetadataDataStructure(filesAndFolders as any),
    fp.omit("sortAlphaNumericallyIndex"),
  );

  return {
    filesAndFolders,
    filesAndFoldersMetadata,
    originalPath: v13.original_path,
    sessionName: v13.session_name,
    tags: v13.tags,
    version: 14,
  };
};

export const v2ToV21Js = (v2: V21): SimpleObject => {
  const filesAndFolders = _.mapValues(
    v2.filesAndFolders,
    fp.pick(["name", "children", "file_size", "file_last_modified"]),
  );

  const filteredComments = _(v2.filesAndFolders)
    .mapValues(({ comments }) => comments)
    .pickBy(comment => comment !== "")
    .value();

  const filteredAliases = _(v2.filesAndFolders)
    .mapValues(({ alias }) => alias)
    .pickBy(alias => alias !== "")
    .value();

  return {
    ...v2,
    aliases: filteredAliases,
    comments: filteredComments,
    filesAndFolders,
    version: 2.1,
  };
};

export const v21ToV22Js = (v21: V21): SimpleObject => {
  const filesAndFolders = _.mapValues(v21.filesAndFolders, (fileAndFolder, id) => ({
    ...fileAndFolder,
    id,
  }));

  return {
    ...v21,
    filesAndFolders,
  };
};
