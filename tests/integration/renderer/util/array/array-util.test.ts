import {
  applyFiltersList,
  BooleanOperator,
  computeCumulative,
  countItems,
  joinFilters,
  makeEmptyArray,
  medianOnSortedArray,
  replaceValue,
} from "@common/utils/array";

describe("array-util", () => {
  describe("computeCumulative", () => {
    describe("with an empty array", () => {
      it("should count return [0]", () => {
        expect(computeCumulative([])).toEqual([0]);
      });
    });

    describe("with [1, 2, 3, 5, 8]", () => {
      it("should count return [0, 1, 3, 6, 11]", () => {
        expect(computeCumulative([1, 2, 3, 5, 8])).toEqual([0, 1, 3, 6, 11]);
      });
    });
  });

  describe("makeEmptyArray", () => {
    const NB_ELEMENTS = 4;
    const DEFAULT_VALUE = "default";
    const array = makeEmptyArray(NB_ELEMENTS, DEFAULT_VALUE);

    it("should have undefined values for each element", () => {
      expect(array).toEqual([
        DEFAULT_VALUE,
        DEFAULT_VALUE,
        DEFAULT_VALUE,
        DEFAULT_VALUE,
      ]);
    });

    it("should be iterable", () => {
      const mapper = jest.fn();
      array.map(mapper);
      expect(mapper).toHaveBeenCalledTimes(NB_ELEMENTS);
    });
  });

  describe("replaceValue", () => {
    const baseArray = ["a", "b", "c", "d"];

    describe("with index in the middle of the array", () => {
      const INDEX_TO_REPLACE = 1;
      const NEW_VALUE = "b2";
      const newArray = replaceValue(baseArray, INDEX_TO_REPLACE, NEW_VALUE);

      it("should not mutate the array", () => {
        expect(baseArray[INDEX_TO_REPLACE]).toBe("b");
      });

      it("should provide a new array with the replaced value", () => {
        expect(newArray).toEqual(["a", "b2", "c", "d"]);
      });
    });

    describe("with index in the beginning of the array", () => {
      const INDEX_TO_REPLACE = 0;
      const NEW_VALUE = "a2";
      const newArray = replaceValue(baseArray, INDEX_TO_REPLACE, NEW_VALUE);

      it("should provide a new array with the replaced value", () => {
        expect(newArray[0]).toBe("a2");
        expect(newArray[1]).toBe("b");
        expect(newArray[2]).toBe("c");
        expect(newArray[3]).toBe("d");
        expect(newArray.length).toBe(4);
      });
    });

    describe("with index at the end of the array", () => {
      const INDEX_TO_REPLACE = 3;
      const NEW_VALUE = "d2";
      const newArray = replaceValue(baseArray, INDEX_TO_REPLACE, NEW_VALUE);

      it("should provide a new array with the replaced value", () => {
        expect(newArray[0]).toBe("a");
        expect(newArray[1]).toBe("b");
        expect(newArray[2]).toBe("c");
        expect(newArray[3]).toBe("d2");
        expect(newArray.length).toBe(4);
      });
    });
  });

  describe("countItems", () => {
    const predicate = (value: any) => value;

    describe("with an empty array", () => {
      it("should return 0", () => {
        expect(countItems(predicate)([])).toEqual(0);
      });
    });

    describe("with a filled array", () => {
      it("should return the right count", () => {
        expect(countItems(predicate)([true, false, true, true])).toEqual(3);
      });
    });

    describe("with a fully false array", () => {
      it("should return the right count", () => {
        expect(countItems(predicate)([false, false, false, false])).toEqual(0);
      });
    });
  });

  describe("medianOnSortedArray", () => {
    describe("on an odd length array", () => {
      const sortedArray = [1, 3, 4, 7, 9];

      it("should return the middle value", () => {
        expect(medianOnSortedArray(sortedArray)).toEqual(4);
      });
    });

    describe("on an event length array", () => {
      const sortedArray = [1, 3, 7, 9];

      it("should return the mean of the two middle value", () => {
        expect(medianOnSortedArray(sortedArray)).toEqual(5);
      });
    });
  });

  describe("applyFiltersList", () => {
    const isOdd = (x: number) => x % 2 === 1;
    const isMultipleOf3 = (x: number) => x % 3 === 0;
    const arrayToFilter = [1, 3, 2, 6, 4, 7, 9];
    const filters = [isOdd, isMultipleOf3];

    it("should apply a list of filters to an array of numbers", () => {
      expect(applyFiltersList(arrayToFilter, filters)).toEqual([3, 9]);
    });

    it("should apply a list of filters to an array of numbers with or operator", () => {
      expect(
        applyFiltersList(arrayToFilter, filters, BooleanOperator.OR)
      ).toEqual([1, 3, 6, 7, 9]);
    });
  });

  describe("joinFilters", () => {
    const isOdd = (x: number) => x % 2 === 1;
    const isMultipleOf3 = (x: number) => x % 3 === 0;

    it("should join a list of filters with or operator", () => {
      const filterMethods = joinFilters(
        [isOdd, isMultipleOf3],
        BooleanOperator.OR
      );
      expect(filterMethods(3)).toEqual(true);
      expect(filterMethods(5)).toEqual(true);
      expect(filterMethods(6)).toEqual(true);
      expect(filterMethods(8)).toEqual(false);
    });

    it("should join a list of filters with and operator", () => {
      const filterMethods = joinFilters(
        [isOdd, isMultipleOf3],
        BooleanOperator.AND
      );
      expect(filterMethods(3)).toEqual(true);
      expect(filterMethods(5)).toEqual(false);
      expect(filterMethods(6)).toEqual(false);
      expect(filterMethods(8)).toEqual(false);
    });
  });
});
