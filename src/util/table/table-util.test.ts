import {
  accessorToFunction,
  getComparator,
  stableSort,
} from "util/table/table-util";

describe("table-util", () => {
  describe("stableSort", () => {
    it("should sort an array in ascending order by id", () => {
      const arrayToSort = [
        { id: "id1", name: "name1" },
        { id: "id4", name: "name4" },
        { id: "id3", name: "name3" },
        { id: "id2", name: "name2" },
      ];
      const comparator = getComparator("asc", accessorToFunction("id"));
      const sortedArray = stableSort(arrayToSort, comparator);
      expect(sortedArray).toEqual([
        { id: "id1", name: "name1" },
        { id: "id2", name: "name2" },
        { id: "id3", name: "name3" },
        { id: "id4", name: "name4" },
      ]);
    });
  });
  describe("stableSort", () => {
    it("should sort an array in descending order by name", () => {
      const arrayToSort = [
        { id: "id2", name: "name2" },
        { id: "id1", name: "name1" },
        { id: "id4", name: "name4" },
        { id: "id3", name: "name3" },
      ];
      const comparator = getComparator("desc", accessorToFunction("name"));
      const sortedArray = stableSort(arrayToSort, comparator);
      expect(sortedArray).toEqual([
        { id: "id4", name: "name4" },
        { id: "id3", name: "name3" },
        { id: "id2", name: "name2" },
        { id: "id1", name: "name1" },
      ]);
    });
  });
});
