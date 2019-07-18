/* eslint-disable no-fallthrough */
import * as Loop from "test/loop";

import { generateRandomString } from "util/random-gen-util";

export const fromAnyJsonToJs = json => {
  const version = JSON.parse(json).version;

  let js;

  switch (version) {
    case 8:
      if (js === undefined) {
        js = JSON.parse(json);
      }
      js = v8JsToV9Js(js);
    case 9:
      if (js === undefined) {
        js = JSON.parse(json);
      }
      js = v9JsToV10Js(js);
    case 10:
      if (js === undefined) {
        js = JSON.parse(json);
      }
      js = v10JsToV11Js(js);
    default:
      if (js === undefined) {
        js = JSON.parse(json);
      }
  }
  return [js, version];
};

const max = (m, l) => {
  return l.reduce((acc, val) => Math.max(acc, val), m);
};

const min = (m, l) => {
  return l.reduce((acc, val) => Math.min(acc, val), m);
};

const median = l => {
  if (l.length % 2 === 1) {
    return l[Math.floor(l.length / 2)];
  } else {
    const i = l.length / 2;
    return (l[i - 1] + l[i]) / 2;
  }
};

const average = l => {
  const sum = l.reduce((acc, val) => acc + val, 0);
  return sum / l.length;
};

const sum = l => {
  return l.reduce((acc, val) => acc + val, 0);
};

const unzip3 = l => {
  return l.reduce(
    (acc, val) => {
      acc[0].push(val[0]);
      acc[1].push(val[1]);
      acc[2].push(val[2]);
      return acc;
    },
    [[], [], []]
  );
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
    for (let key in table) {
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
    for (let key in tags) {
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
