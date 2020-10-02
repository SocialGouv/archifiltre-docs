import { makeObjectKeyComparator } from "util/sort-utils/sort-utils";

describe("sort-util", () => {
  describe("makeObjectKeyComparator", () => {
    it("should return 0 for equal values", () => {
      expect(makeObjectKeyComparator("a")({ a: 1 }, { a: 1 })).toBe(0);
    });

    it("should return 1 if first parameter is larger than second parameter", () => {
      expect(makeObjectKeyComparator("a")({ a: 2 }, { a: 1 })).toBe(1);
    });

    it("should return -1 if second parameter is larger than first parameter", () => {
      expect(makeObjectKeyComparator("a")({ a: 1 }, { a: 2 })).toBe(-1);
    });
  });
});
