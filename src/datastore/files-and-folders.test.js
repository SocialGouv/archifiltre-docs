import fc from "fast-check";
import * as M from "datastore/files-and-folders";
import * as Origin from "datastore/origin";
import { updateIn } from "immutable";
import path from "path";
import { arbitraryFF, arbitraryOrigins } from "../test/custom-arbitraries";
import equal from "deep-equal";
import { compose } from "../util/function-util";

describe("files-and-folders", () => {
  it("(ffInv . ff)", () => {
    fc.assert(
      fc.property(arbitraryOrigins, origins =>
        equal(Origin.sort(M.ffInv(M.ff(origins))), Origin.sort(origins))
      )
    );
  });

  it("(fromJs . toJs)", () => {
    fc.assert(
      fc.property(arbitraryFF, ff => {
        const ffWithDerivedData = M.computeDerived(ff);
        const expected = ffWithDerivedData.toJS();
        const actual = M.fromJs(M.toJs(ffWithDerivedData)).toJS();

        return equal(actual, expected);
      })
    );
  });

  it("(ffInv . fromJs . toJs . computeDerived . ff) a", () => {
    fc.assert(
      fc.property(arbitraryOrigins, origins => {
        const actual = compose(
          Origin.sort,
          M.ffInv,
          M.fromJs,
          M.toJs,
          M.computeDerived,
          M.ff
        )(origins);
        const expected = Origin.sort(origins);
        return equal(actual, expected);
      })
    );
  });

  it("merge empty a === merge a empty", () => {
    fc.assert(
      fc.property(arbitraryFF, ff => {
        const actual = M.merge(M.empty(), ff).toJS();
        const expected = M.merge(ff, M.empty()).toJS();
        return equal(actual, expected);
      })
    );
  });

  it("merge (merge a b) c === merge a (merge b c)", () => {
    fc.property(
      fc.tuple(arbitraryFF, arbitraryFF, arbitraryFF),
      ([ff1, ff2, ff3]) => {
        const actual = M.merge(M.merge(ff1, ff2), ff3).toJS();
        const expected = M.merge(ff1, M.merge(ff2, ff3)).toJS();
        return equal(actual, expected);
      }
    );
  });

  it("simple derived data test", () => {
    const origin = [
      [{ size: 1, lastModified: 5 }, "/a/b/c"],
      [{ size: 2, lastModified: 4 }, "/a/b/d"],
      [{ size: 3, lastModified: 3 }, "/a/e/f"],
      [{ size: 4, lastModified: 2 }, "/a/e/g"],
      [{ size: 5, lastModified: 1 }, "/h"]
    ];
    const data = M.ff(origin);
    const derived = M.computeDerived(data);

    const test = (a, updater, predicates) => {
      Object.keys(updater).forEach(key => (a = a.update(key, updater[key])));
      Object.keys(predicates).forEach(key =>
        expect(a.get(key)).toEqual(predicates[key])
      );
    };

    const updater = {
      children: a => a.sort().toArray(),
      last_modified_list: a => a.sort().toArray(),
      sort_by_size_index: a => a.toArray(),
      sort_by_date_index: a => a.toArray()
    };

    test(derived.get(""), updater, {
      name: "",
      alias: "",
      comments: "",
      children: ["/a", "/h"],
      size: 15,
      last_modified_max: 5,
      last_modified_list: [1, 2, 3, 4, 5],
      last_modified_min: 1,
      last_modified_median: 3,
      last_modified_average: 3,
      depth: 0,
      nb_files: 5,
      sort_by_size_index: [0, 1],
      sort_by_date_index: [1, 0]
    });

    test(derived.get("/h"), updater, {
      file_size: 5,
      file_last_modified: 1,
      name: "h",
      alias: "",
      comments: "",
      children: [],
      size: 5,
      last_modified_max: 1,
      last_modified_list: [1],
      last_modified_min: 1,
      last_modified_median: 1,
      last_modified_average: 1,
      depth: 1,
      nb_files: 1,
      sort_by_size_index: [],
      sort_by_date_index: []
    });

    test(derived.get("/a"), updater, {
      name: "a",
      alias: "",
      comments: "",
      children: ["/a/b", "/a/e"],
      size: 10,
      last_modified_max: 5,
      last_modified_list: [2, 3, 4, 5],
      last_modified_min: 2,
      last_modified_median: 3.5,
      last_modified_average: 3.5,
      depth: 1,
      nb_files: 4,
      sort_by_size_index: [1, 0],
      sort_by_date_index: [1, 0]
    });

    test(derived.get("/a/b"), updater, {
      name: "b",
      alias: "",
      comments: "",
      children: ["/a/b/c", "/a/b/d"],
      size: 3,
      last_modified_max: 5,
      last_modified_list: [4, 5],
      last_modified_min: 4,
      last_modified_median: 4.5,
      last_modified_average: 4.5,
      depth: 2,
      nb_files: 2,
      sort_by_size_index: [1, 0],
      sort_by_date_index: [1, 0]
    });

    test(derived.get("/a/b/c"), updater, {
      name: "c",
      alias: "",
      comments: "",
      children: [],
      size: 1,
      last_modified_max: 5,
      last_modified_list: [5],
      last_modified_min: 5,
      last_modified_median: 5,
      last_modified_average: 5,
      depth: 3,
      nb_files: 1,
      sort_by_size_index: [],
      sort_by_date_index: []
    });

    test(derived.get("/a/b/d"), updater, {
      name: "d",
      alias: "",
      comments: "",
      children: [],
      size: 2,
      last_modified_max: 4,
      last_modified_list: [4],
      last_modified_min: 4,
      last_modified_median: 4,
      last_modified_average: 4,
      depth: 3,
      nb_files: 1,
      sort_by_size_index: [],
      sort_by_date_index: []
    });

    test(derived.get("/a/e"), updater, {
      name: "e",
      alias: "",
      comments: "",
      children: ["/a/e/f", "/a/e/g"],
      size: 7,
      last_modified_max: 3,
      last_modified_list: [2, 3],
      last_modified_min: 2,
      last_modified_median: 2.5,
      last_modified_average: 2.5,
      depth: 2,
      nb_files: 2,
      sort_by_size_index: [1, 0],
      sort_by_date_index: [1, 0]
    });

    test(derived.get("/a/e/f"), updater, {
      name: "f",
      alias: "",
      comments: "",
      children: [],
      size: 3,
      last_modified_max: 3,
      last_modified_list: [3],
      last_modified_min: 3,
      last_modified_median: 3,
      last_modified_average: 3,
      depth: 3,
      nb_files: 1,
      sort_by_size_index: [],
      sort_by_date_index: []
    });

    test(derived.get("/a/e/g"), updater, {
      name: "g",
      alias: "",
      comments: "",
      children: [],
      size: 4,
      last_modified_max: 2,
      last_modified_list: [2],
      last_modified_min: 2,
      last_modified_median: 2,
      last_modified_average: 2,
      depth: 3,
      nb_files: 1,
      sort_by_size_index: [],
      sort_by_date_index: []
    });
  });

  it("simple toStrList2 test", () => {
    const origin = [
      [{ size: 1, lastModified: 5 }, "/a/b/c.ext"],
      [{ size: 2, lastModified: 4 }, "/a/b/d"],
      [{ size: 3, lastModified: 3 }, "/a/e/f"],
      [{ size: 4, lastModified: 2 }, "/a/e/g"],
      [{ size: 5, lastModified: 1 }, "/h"]
    ];
    const data = M.ff(origin);
    let derived = M.computeDerived(data);

    derived = updateIn(derived, ["/h", "comments"], a => "my comments");
    derived = updateIn(derived, ["/h", "alias"], a => "my alias");
    derived = updateIn(derived, ["/a/b/d", "comments"], a => "my comments 2");
    derived = updateIn(derived, ["/a/e/g", "alias"], a => "my alias 2");

    const root_id = "";
    const ff_id_list = M.toFfidList(derived)
      .sort()
      .filter(a => a != root_id);
    const str_list_2 = M.toStrList2(ff_id_list, derived);

    expect(str_list_2).toEqual([
      [
        "",
        "path",
        "path length",
        "name",
        "extension",
        "size (octet)",
        "last_modified",
        "alias",
        "comments",
        "file/folder",
        "depth"
      ],
      // path.join enables windows compatibility
      ["", path.join("/a"), 2, "a", "", 10, "01/01/1970", "", "", "folder", 1],

      ["", path.join("/a/b"), 4, "b", "", 3, "01/01/1970", "", "", "folder", 2],
      [
        "",
        path.join("/a/b/c.ext"),
        10,
        "c.ext",
        ".ext",
        1,
        "01/01/1970",
        "",
        "",
        "file",
        3
      ],
      [
        "",
        path.join("/a/b/d"),
        6,
        "d",
        "",
        2,
        "01/01/1970",
        "",
        "my comments 2",
        "file",
        3
      ],

      ["", path.join("/a/e"), 4, "e", "", 7, "01/01/1970", "", "", "folder", 2],
      ["", path.join("/a/e/f"), 6, "f", "", 3, "01/01/1970", "", "", "file", 3],
      [
        "",
        path.join("/a/e/g"),
        6,
        "g",
        "",
        4,
        "01/01/1970",
        "my alias 2",
        "",
        "file",
        3
      ],

      [
        "",
        path.join("/h"),
        2,
        "h",
        "",
        5,
        "01/01/1970",
        "my alias",
        "my comments",
        "file",
        1
      ]
    ]);
  });
});
