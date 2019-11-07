import fc from "fast-check";
import * as FF from "datastore/files-and-folders";
import * as Origin from "datastore/origin";
import { arbitraryFF, arbitraryOrigins } from "../test/custom-arbitraries";
import equal from "deep-equal";
import { compose } from "../util/function-util";

describe("files-and-folders", () => {
  it("(ffInv . ff)", () => {
    fc.assert(
      fc.property(arbitraryOrigins, origins =>
        equal(Origin.sort(FF.ffInv(FF.ff(origins))), Origin.sort(origins))
      )
    );
  });

  it("(fromJs . toJs)", () => {
    fc.assert(
      fc.property(arbitraryFF, ff => {
        const ffWithDerivedData = FF.computeDerived(ff);
        const expected = ffWithDerivedData.toJS();
        const actual = FF.fromJs(FF.toJs(ffWithDerivedData)).toJS();

        return equal(actual, expected);
      })
    );
  });

  it("(ffInv . fromJs . toJs . computeDerived . ff) a", () => {
    fc.assert(
      fc.property(arbitraryOrigins, origins => {
        const actual = compose(
          Origin.sort,
          FF.ffInv,
          FF.fromJs,
          FF.toJs,
          FF.computeDerived,
          FF.ff
        )(origins);
        const expected = Origin.sort(origins);
        return equal(actual, expected);
      })
    );
  });

  it("merge empty a === merge a empty", () => {
    fc.assert(
      fc.property(arbitraryFF, ff => {
        const actual = FF.merge(FF.empty(), ff).toJS();
        const expected = FF.merge(ff, FF.empty()).toJS();
        return equal(actual, expected);
      })
    );
  });

  it("merge (merge a b) c === merge a (merge b c)", () => {
    fc.property(
      fc.tuple(arbitraryFF, arbitraryFF, arbitraryFF),
      ([ff1, ff2, ff3]) => {
        const actual = FF.merge(FF.merge(ff1, ff2), ff3).toJS();
        const expected = FF.merge(ff1, FF.merge(ff2, ff3)).toJS();
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
    const data = FF.ff(origin);
    const derived = FF.computeDerived(data);

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
    const firstId = "/rootFolder/filename";
    const filesAndFolders = {
      [firstId]: {
        alias: "",
        children: [],
        comments: "",
        file_last_modified: 1570615679168,
        file_size: 10,
        hash: null,
        id: firstId,
        name: "filename"
      }
    };

    const metadata = {
      [firstId]: {
        averageLastModified: 3000,
        childrenTotalSize: 10000,
        maxLastModified: 1570615679168,
        medianLastModified: 4000,
        minLastModified: 1000
      }
    };

    const strList2 = FF.toStrList2(filesAndFolders, metadata);

    expect(strList2).toEqual([
      [
        "",
        "path",
        "path length",
        "name",
        "extension",
        "size (octet)",
        "last_modified",
        "new name",
        "description",
        "file/folder",
        "depth"
      ],
      [
        "",
        "/rootFolder/filename",
        20,
        "filename",
        "",
        10000,
        "09/10/2019",
        "",
        "",
        "file",
        1
      ]
    ]);
  });
});
