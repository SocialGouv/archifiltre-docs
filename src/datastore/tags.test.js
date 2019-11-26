import * as FilesAndFolders from "datastore/files-and-folders";
import * as Tags from "datastore/tags";

import { Set } from "immutable";

describe("tags", () => {
  it("simple derived data test", () => {
    const ff = FilesAndFolders.computeDerived(
      FilesAndFolders.ff([
        [{ size: 1, lastModified: 0 }, "/a/b/c"],
        [{ size: 2, lastModified: 0 }, "/a/b/d"],
        [{ size: 3, lastModified: 0 }, "/a/e"],
        [{ size: 4, lastModified: 0 }, "/a/f/g"]
      ])
    );

    let tags = Tags.empty();
    tags = Tags.update(ff, tags);

    tags = Tags.push(
      Tags.create({ name: "T", ff_ids: Set.of("/a/b", "/a/b/d") }),
      tags
    );
    tags = Tags.push(
      Tags.create({ name: "U", ff_ids: Set.of("/a/e", "/a/b/d") }),
      tags
    );
    tags = Tags.push(
      Tags.create({ name: "T", ff_ids: Set.of("/a/f/g") }),
      tags
    );
    tags = Tags.push(Tags.create({ name: "V", ff_ids: Set() }), tags);

    tags = Tags.update(ff, tags);

    const test = (a, updater, predicates) => {
      Object.keys(updater).forEach(key => (a = a.update(key, updater[key])));
      Object.keys(predicates).forEach(key =>
        expect(a.get(key)).toEqual(predicates[key])
      );
    };

    const getter = (name, tags) => {
      const ans = tags.findEntry(val => val.get("name") === name);
      if (ans) {
        return ans[1];
      } else {
        return ans;
      }
    };

    const updater = {
      ff_ids: a => a.sort().toArray()
    };

    test(getter("T", tags), updater, {
      name: "T",
      ff_ids: ["/a/b", "/a/b/d", "/a/f/g"],
      size: 7
    });

    test(getter("U", tags), updater, {
      name: "U",
      ff_ids: ["/a/b/d", "/a/e"],
      size: 5
    });

    expect(getter("V", tags)).not.toBeDefined();
  });

  it("simple toStrList2 test", () => {
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
        file_last_modified: 1570615679168,
        file_size: 10,
        hash: null,
        id: rootId,
        name: "root"
      },
      [taggedFfId]: {
        alias: "",
        children: [],
        comments: "",
        file_last_modified: 1570615679168,
        file_size: 10,
        hash: null,
        id: taggedFfId,
        name: "filename"
      }
    };

    const strList2 = Tags.toStrList2(filesAndFolders, tags);

    expect(strList2).toEqual([["tag0 : test-tag-1", "tag1 : "], undefined]);
  });
});
