import { generateRandomString } from "util/random-gen-util";
import * as RecordUtil from "util/record-util";
import * as ObjectUtil from "util/object-util.ts";

import { List, Map, Set } from "immutable";
import {
  getAllTagsForFile,
  tagMapToArray
} from "../reducers/tags/tags-selectors";

const tagFactory = RecordUtil.createFactory(
  {
    name: "",
    ff_ids: Set()
  },
  {
    toJs: a =>
      ObjectUtil.compose(
        {
          ff_ids: a.ff_ids.toArray()
        },
        a
      ),
    fromJs: a =>
      ObjectUtil.compose(
        {
          ff_ids: Set(a.ff_ids)
        },
        a
      )
  }
);

const derivedFactory = RecordUtil.createFactory(
  {
    size: 0
  },
  {
    toJs: a => a,
    fromJs: a => a
  }
);

export const create = tagFactory;

const makeId = () => generateRandomString(40);

export const empty = Map;

const insert = (id, tag, tags) => {
  const already_id = tags.reduce((acc, val, i) => {
    if (val.get("name") === tag.get("name")) {
      acc = i;
    }
    return acc;
  }, undefined);

  if (already_id) {
    tags = tags.update(already_id, a =>
      a.update("ff_ids", b => b.concat(tag.get("ff_ids")))
    );
  } else {
    tags = tags.set(id, tag);
  }
  return tags;
};

/**
 *
 * @param tag - The tag to push to the list
 * @param tags - The tag list to push the tag in
 * @param {string}[id] - The tag ID. Allows to force the id.
 * @returns {*}
 */
export const push = (tag, tags, { id } = {}) => tags.set(id || makeId(), tag);

const computeDerived = (ffs, tags) => {
  tags = tags.map(tagFactory);

  const sortBySize = ids => {
    const compare = (a, b) => {
      const s_a = ffs.get(a).get("size");
      const s_b = ffs.get(b).get("size");
      if (s_a > s_b) {
        return -1;
      } else if (s_a === s_b) {
        return 0;
      } else {
        return 1;
      }
    };
    const sizes = ids.sort(compare);
    return sizes;
  };

  const filterChildren = ids => {
    const getAllChildren = id => {
      const children = ffs.get(id).get("children");
      return children.concat(
        children
          .map(getAllChildren)
          .reduce((acc, val) => acc.concat(val), List())
      );
    };

    if (ids.size <= 1) {
      return ids;
    } else {
      const head_id = ids.get(0);
      const children_head_id = getAllChildren(head_id);

      const tail = ids.slice(1);
      const filtered_tail = tail.filter(
        a => children_head_id.includes(a) === false
      );

      return List.of(head_id).concat(filterChildren(filtered_tail));
    }
  };

  const reduceToSize = ids => {
    return ids.reduce((acc, val) => acc + ffs.get(val).get("size"), 0);
  };

  tags = tags.map(tag => {
    const ids = List(tag.get("ff_ids"));

    tag = RecordUtil.compose(
      derivedFactory({
        size: reduceToSize(filterChildren(sortBySize(ids)))
      }),
      tag
    );

    return tag;
  });

  return tags;
};

export const update = (ffs, tags) => {
  tags = tags.reduce((acc, val, id) => insert(id, val, acc), empty());
  tags = tags.filter(val => val.get("ff_ids").size !== 0);
  tags = computeDerived(ffs, tags);

  return tags;
};

const toAndFromJs = factory => [
  a => {
    a = a.map(factory.toJs);
    a = a.toObject();

    return a;
  },
  a => {
    a = Map(a);
    a = a.map(factory.fromJs);

    return a;
  }
];

export const [toJs, fromJs] = toAndFromJs(
  RecordUtil.composeFactory(derivedFactory, tagFactory)
);

/**
 * Get an array with all the tag name
 * @param tags
 */
const toNameList = tagsArray => tagsArray.map(({ name }) => name);

/**
 * Generates an array of array ([[]]) with the first line being
 * the csv header.
 *
 * Each line represents one file or folder and the order is determined
 * by the file and folder id array (ff_id_list).
 *
 * Parent tags are inherited by all their children during the export.
 *
 * @param ffs - files and folders tree
 * @param tags
 */
export const toStrList2 = (ffs, tags) => {
  const rootFfId = "";
  const ffIds = Object.keys(ffs).filter(id => id !== rootFfId);
  const tagsArray = tagMapToArray(tags);
  const tagNamesList = toNameList(tagsArray);
  const header = tagNamesList.map(
    (tagName, index) => `tag${index} : ${tagName}`
  );

  const mapFfidToStrList = {};

  const rec = (parentTags, currentFfId) => {
    const currentFf = ffs[currentFfId];
    let currentFfTagNames = getAllTagsForFile(tags, currentFfId).map(
      ({ name }) => name
    );
    currentFfTagNames = currentFfTagNames.concat(parentTags);

    mapFfidToStrList[currentFfId] = tagNamesList.map(tagName =>
      currentFfTagNames.includes(tagName) ? tagName : ""
    );

    const currentFfChildren = currentFf.children;
    currentFfChildren.forEach(id => rec(currentFfTagNames, id));
  };

  rec([], rootFfId);

  return [header, ...ffIds.map(id => mapFfidToStrList[id])];
};
