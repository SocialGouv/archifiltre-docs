import * as Loop from "test/loop";
import * as Arbitrary from "test/arbitrary";
import * as M from "util/array-util";
import { makeEmptyArray } from "util/array-util";
import { replaceValue } from "./array-util";

describe("array-util", function() {
  Loop.equal("(unzip . zip) a", () => {
    const index = () => 1 + Arbitrary.index();
    const i = index();
    const a = () => Arbitrary.arrayWithIndex(() => i)(Arbitrary.natural);
    const b = Arbitrary.arrayWithIndex(index)(a);
    return [M.unzip(M.zip(b)), b];
  });

  it("join", () => {
    const a = [[1, 2, 3], [3, 5], [9]];
    expect(M.join(a)).toEqual([1, 2, 3, 3, 5, 9]);
  });

  describe("makeEmptyArray", () => {
    describe("withoutDefaultValue", () => {
      const NB_ELEMENTS = 4;
      const array = makeEmptyArray(NB_ELEMENTS);

      it("should have undefined values for each element", () => {
        expect(array[0]).toBeUndefined();
        expect(array[1]).toBeUndefined();
        expect(array[2]).toBeUndefined();
        expect(array[3]).toBeUndefined();
      });

      it("should be iterable", () => {
        const mapper = jest.fn();
        array.map(mapper);
        expect(mapper).toHaveBeenCalledTimes(NB_ELEMENTS);
      });
    });

    describe("with default value", () => {
      const NB_ELEMENTS = 4;
      const DEFAULT_VALUE = "default";
      const array = makeEmptyArray(NB_ELEMENTS, DEFAULT_VALUE);

      it("should have undefined values for each element", () => {
        expect(array[0]).toBe(DEFAULT_VALUE);
        expect(array[1]).toBe(DEFAULT_VALUE);
        expect(array[2]).toBe(DEFAULT_VALUE);
        expect(array[3]).toBe(DEFAULT_VALUE);
      });
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
        expect(newArray[0]).toBe("a");
        expect(newArray[1]).toBe("b2");
        expect(newArray[2]).toBe("c");
        expect(newArray[3]).toBe("d");
        expect(newArray.length).toBe(4);
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
});
