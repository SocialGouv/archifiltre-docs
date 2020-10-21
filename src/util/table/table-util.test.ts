import {
  accessorToFunction,
  applyAccessorToTableValue,
  getComparator,
  stableSort,
  tableContentToArray,
} from "util/table/table-util";
import { Column } from "components/common/table/table-types";

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

  describe("applyAccessorToTableValue", () => {
    type TestData = {
      name: string;
    };

    it("should work with a function accessor", () => {
      const data: TestData = {
        name: "test-name",
      };
      const accessor = (value, index) => `${value.name}-${index}`;

      expect(applyAccessorToTableValue(data, accessor, 1)).toBe("test-name-1");
    });

    it("should work with a prop accessor", () => {
      const data: TestData = {
        name: "test-name",
      };

      expect(applyAccessorToTableValue(data, "name")).toBe("test-name");
    });
  });

  describe("tableContentToArray", () => {
    type TestData = {
      name: string;
      value: string;
    };

    it("should generate a string[][] from table data and config", () => {
      const data: TestData[] = [
        {
          name: "first-name",
          value: "first-value",
        },
        {
          name: "second-name",
          value: "second-value",
        },
      ];

      const columns: Column<TestData>[] = [
        {
          id: "name",
          name: "name",
          accessor: "name",
        },
        {
          id: "value",
          name: "value",
          accessor: ({ value }) => `accessor(${value})`,
        },
      ];

      const table = tableContentToArray(data, columns);

      expect(table).toEqual([
        ["name", "value"],
        ["first-name", "accessor(first-value)"],
        ["second-name", "accessor(second-value)"],
      ]);
    });
  });
});
