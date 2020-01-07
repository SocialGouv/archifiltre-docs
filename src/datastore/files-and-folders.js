import { concat, zip } from "lodash";
import translations from "../translations/translations";

import * as ListUtil from "util/list-util";
import * as RecordUtil from "util/record-util";

import { List, Map } from "immutable";

import { epochToFormattedUtcDateString } from "csv";
import { getFilesAndFoldersDepth } from "reducers/files-and-folders/files-and-folders-selectors";
import { expectToBeDefined } from "../util/expect-behaviour";
const Path = require("path");

const fileOrFolderFactory = RecordUtil.createFactory(
  {
    name: "",
    alias: "",
    comments: "",
    children: List(),
    file_size: 0,
    file_last_modified: 0,
    hash: null
  },
  {
    toJs: a => ({
      ...a,
      children: a.children.toArray()
    }),
    fromJs: a => ({
      ...a,
      children: List(a.children)
    })
  }
);

export const ff = (a, hook) => {
  const mapper = ([file, path]) => {
    const names = path.split("/");
    const ids = names.map((name, i) => names.slice(0, i + 1).join("/"));
    const childrens = ids
      .slice(1)
      .map(a => List.of(a))
      .concat([List()]);
    let m = Map();

    const loop = zip(names, ids, childrens);
    loop.forEach(([name, id, children]) => {
      m = m.set(
        id,
        fileOrFolderFactory({
          name,
          children
        })
      );
    });

    ids.slice(-1).forEach(id => {
      m = m.update(id, a => {
        a = a.set("file_size", file.size);
        a = a.set("file_last_modified", file.lastModified);
        return a;
      });
    });

    if (hook) {
      hook(m);
    }

    return m;
  };

  return a.map(mapper).reduce((acc, val) => merge(val, acc), empty());
};

export const empty = () =>
  Map({
    "": fileOrFolderFactory()
  });

export const merge = (a, b) => {
  const merger = (oldVal, newVal) => {
    oldVal = oldVal.update("children", b =>
      b.concat(newVal.get("children").filter(a => b.includes(a) === false))
    );
    return oldVal;
  };
  return b.mergeWith(merger, a);
};

const reduce = (reducer, m) => {
  const rec = id => {
    const node = m.get(id);
    const children_ans_array = node
      .get("children")
      .toArray()
      .map(rec);
    const [ans, next_node] = reducer([children_ans_array, node]);
    m = m.set(id, next_node);
    return ans;
  };

  return [rec(""), m];
};

const dive = (diver, first_ans, m) => {
  const rec = (parent_ans, id) => {
    const node = m.get(id);
    const [ans, next_node] = diver([parent_ans, node]);
    m = m.set(id, next_node);
    node.get("children").forEach(id => rec(ans, id));
  };
  rec(first_ans, "");

  return m;
};

/**
 * Test utility that reduces a fileAndFolders structure into an origin list
 * @param fileAndFolders - The file and folders structure
 * @returns {*}
 */
export const ffInv = fileAndFolders => {
  const reducer = ([children_ans_array, node]) => {
    if (children_ans_array.length === 0) {
      const file = {
        size: node.get("file_size"),
        lastModified: node.get("file_last_modified")
      };
      const path = node.get("name");
      const ans = [[file, path]];
      return [ans, node];
    } else {
      children_ans_array = concat(...children_ans_array);
      const ans = children_ans_array.map(a => {
        const path = node.get("name") + "/" + a[1];
        return [a[0], path];
      });

      return [ans, node];
    }
  };
  const [ans] = reduce(reducer, fileAndFolders);
  return ans;
};

const derivedFactory = RecordUtil.createFactory(
  {
    size: 0,
    last_modified_max: 0,
    last_modified_list: List(),
    last_modified_min: Number.MAX_SAFE_INTEGER,
    last_modified_median: null,
    last_modified_average: null,
    depth: 0,
    nb_files: 0,
    sort_by_size_index: List(),
    sort_by_date_index: List()
  },
  {
    toJs: partiallyConvertedFilesAndFolders => {
      const currentFn = "files-and-folders/derivedFactory/toJs";

      /**
       * Converts the data to an array. Handles the weird case where value is undefined.
       * Reports these unexpected cases
       * @param data - The partiallyConvertedFilesAndFolders
       * @param key - The field to change
       * @returns {Array} - The value converted to an array or an empty array if value is undefined
       */
      const convertToArray = (data, key) => {
        const value = data[key];
        const isValueDefined = expectToBeDefined(value, `${currentFn}: ${key}`);

        return isValueDefined ? value.toArray() : [];
      };

      return {
        ...partiallyConvertedFilesAndFolders,
        last_modified_list: convertToArray(
          partiallyConvertedFilesAndFolders,
          "last_modified_list"
        ),
        sort_by_size_index: convertToArray(
          partiallyConvertedFilesAndFolders,
          "sort_by_size_index"
        ),
        sort_by_date_index: convertToArray(
          partiallyConvertedFilesAndFolders,
          "sort_by_date_index"
        )
      };
    },
    fromJs: a => ({
      ...a,
      last_modified_list: List(a.last_modified_list),
      sort_by_size_index: List(a.sort_by_size_index),
      sort_by_date_index: List(a.sort_by_date_index)
    })
  }
);

const mergeDerived = (a, b) => {
  b = b.update("size", b => b + a.get("size"));
  b = b.update("last_modified_list", b =>
    b.concat(a.get("last_modified_list"))
  );
  b = b.update("nb_files", b => b + a.get("nb_files"));
  return b;
};

const afterMergeDerived = a => {
  const list = a.get("last_modified_list");
  a = a.set("last_modified_max", list.max());
  a = a.set("last_modified_min", list.min());
  a = a.set("last_modified_median", ListUtil.median(list));
  a = a.set("last_modified_average", ListUtil.average(list));
  return a;
};

const sortChildren = (children_ans_array, a) => {
  const children_ans = List(children_ans_array);
  a = a.set(
    "sort_by_size_index",
    ListUtil.indexSort(a => a.get("size"), children_ans).reverse()
  );
  a = a.set(
    "sort_by_date_index",
    ListUtil.indexSort(a => a.get("last_modified_average"), children_ans)
  );
  return a;
};

export const computeDerived = (m, hook) => {
  m = m.map(fileOrFolderFactory);
  const reducer = ([children_ans_array, node]) => {
    let ans;
    if (children_ans_array.length === 0) {
      const flm = node.get("file_last_modified");
      const size = node.get("file_size");
      ans = derivedFactory({
        size,
        last_modified_max: flm,
        last_modified_list: List.of(flm),
        last_modified_min: flm,
        last_modified_median: flm,
        last_modified_average: flm,
        nb_files: 1
      });
    } else {
      ans = children_ans_array.reduce((acc, val) => mergeDerived(val, acc));
      ans = afterMergeDerived(ans);
      ans = sortChildren(children_ans_array, ans);
    }
    node = RecordUtil.compose(ans, node);

    if (hook) {
      hook("reducedFilesAndFolders", ans, node);
    }

    return [ans, node];
  };
  let [, next_m] = reduce(reducer, m);

  const diver = ([parent_ans, node]) => {
    node = node.set("depth", parent_ans);
    parent_ans = parent_ans + 1;

    if (hook) {
      hook("divedFilesAndFolders", parent_ans, node);
    }

    return [parent_ans, node];
  };
  next_m = dive(diver, 0, next_m);

  return next_m;
};

const toAndFromJs = factory => [
  a => a.map(factory.toJs).toObject(),
  a => Map(a).map(factory.fromJs)
];

export const [toJs, fromJs] = toAndFromJs(
  RecordUtil.composeFactory(derivedFactory, fileOrFolderFactory)
);

const strListToHeader = [
  "",
  translations.t("csvHeader.path"),
  translations.t("csvHeader.pathLength"),
  translations.t("csvHeader.name"),
  translations.t("csvHeader.extension"),
  translations.t("csvHeader.size"),
  translations.t("csvHeader.lastModified"),
  translations.t("csvHeader.newName"),
  translations.t("csvHeader.description"),
  translations.t("csvHeader.fileOrFolder"),
  translations.t("csvHeader.depth")
];
/**
 * Generates an array of array ([[]]) with the first line being
 * the csv header.
 *
 * Each line represents one file or folder and the order is determined
 * by the file and folder id array.
 *
 * @param filesAndFolders - files and folders tree
 * @param filesAndFoldersMetadata - files and folders tree metadata
 */
export const toStrList2 = (filesAndFolders, filesAndFoldersMetadata) => {
  const rootId = "";
  const filesAndFoldersWithoutRoot = Object.values(filesAndFolders).filter(
    filesAndFolder => filesAndFolder.id !== rootId
  );
  const ffFormattedArray = filesAndFoldersWithoutRoot.map(ff => {
    if (ff.id === "") {
      return undefined;
    }
    const currentMetadata = filesAndFoldersMetadata[ff.id];
    const platform_dependent_path = ff.id.split("/").join(Path.sep);
    const path_length = platform_dependent_path.length;
    const name = ff.name;
    const extension = Path.extname(name);
    const size = currentMetadata.childrenTotalSize;
    const last_modified = epochToFormattedUtcDateString(
      currentMetadata.maxLastModified
    );
    const alias = ff.alias;
    const comments = ff.comments;
    const children = ff.children;
    const file_or_folder =
      children.length === 0
        ? translations.t("common.file")
        : translations.t("common.folder");
    const depth = getFilesAndFoldersDepth(ff.id);

    return [
      "",
      platform_dependent_path,
      path_length,
      name,
      extension,
      size,
      last_modified,
      alias,
      comments,
      file_or_folder,
      depth
    ];
  });

  return [strListToHeader.slice(), ...ffFormattedArray];
};
