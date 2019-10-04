import * as FilesAndFolders from "datastore/files-and-folders";
import * as M from "datastore/tags";

import { Set } from "immutable";

describe("tags", function() {
  it("simple derived data test", () => {
    const ff = FilesAndFolders.computeDerived(
      FilesAndFolders.ff([
        [{ size: 1, lastModified: 0 }, "/a/b/c"],
        [{ size: 2, lastModified: 0 }, "/a/b/d"],
        [{ size: 3, lastModified: 0 }, "/a/e"],
        [{ size: 4, lastModified: 0 }, "/a/f/g"]
      ])
    );

    let tags = M.empty();
    tags = M.update(ff, tags);

    tags = M.push(
      M.create({ name: "T", ff_ids: Set.of("/a/b", "/a/b/d") }),
      tags
    );
    tags = M.push(
      M.create({ name: "U", ff_ids: Set.of("/a/e", "/a/b/d") }),
      tags
    );
    tags = M.push(M.create({ name: "T", ff_ids: Set.of("/a/f/g") }), tags);
    tags = M.push(M.create({ name: "V", ff_ids: Set() }), tags);

    tags = M.update(ff, tags);

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
    const ff = FilesAndFolders.computeDerived(
      FilesAndFolders.ff([
        [{ size: 1, lastModified: 0 }, "/a/b/c"],
        [{ size: 2, lastModified: 0 }, "/a/b/d"],
        [{ size: 3, lastModified: 0 }, "/a/e"],
        [{ size: 4, lastModified: 0 }, "/a/f/g"]
      ])
    );

    const tags = {
      id: {
        id: "id",
        name: "T",
        ffIds: ["/a/b", "/a/f/g"]
      },
      id2: {
        id: "id2",
        name: "U",
        ffIds: ["/a"]
      },
      id3: {
        id: "id3",
        name: "X",
        ffIds: ["/a/b/d"]
      }
    };

    const root_id = "";
    const ff_id_list = FilesAndFolders.toFfidList(ff)
      .sort()
      .filter(a => a !== root_id);
    const str_list_2 = M.toStrList2(ff_id_list, ff, tags);

    expect(str_list_2).toEqual([
      ["tag0 : T", "tag1 : U", "tag2 : X"],

      ["", "U", ""], // /a

      ["T", "U", ""], // /a/b
      ["T", "U", ""], // /a/b/c
      ["T", "U", "X"], // /a/b/d

      ["", "U", ""], // /a/e

      ["", "U", ""], // /a/f
      ["T", "U", ""] // /a/f/g
    ]);
  });
});
