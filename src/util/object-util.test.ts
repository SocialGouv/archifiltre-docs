import fc from "fast-check";
import { compose, copy, extractKeys, removeKey } from "./object-util";

describe("object-util", () => {
  describe("compose", () => {
    it("should properly create an object with first object merged into second object", () => {
      const first = {
        firstKey: "firstValue",
        overlappedKey: "firstOverlappedValue"
      };
      const second = {
        overlappedKey: "secondOverlappedValue",
        secondKey: "secondValue"
      };

      expect(
        compose(
          first,
          second
        )
      ).toEqual({
        firstKey: "firstValue",
        overlappedKey: "firstOverlappedValue",
        secondKey: "secondValue"
      });
    });

    it("should always contain first object values", () => {
      fc.assert(
        fc.property(fc.object(), fc.object(), (a: any, b: any) => {
          expect(
            compose(
              a,
              b
            )
          ).toMatchObject(a);
        })
      );
    });

    it("should always contain all the keys of the first object", () => {
      fc.assert(
        fc.property(fc.object(), fc.object(), (a: any, b: any) => {
          expect(
            Object.keys(
              compose(
                a,
                b
              )
            )
          ).toEqual(expect.arrayContaining(Object.keys(a)));
        })
      );
    });

    it("should always contain all the keys of the second object", () => {
      fc.assert(
        fc.property(fc.object(), fc.object(), (a: any, b: any) => {
          expect(
            Object.keys(
              compose(
                a,
                b
              )
            )
          ).toEqual(expect.arrayContaining(Object.keys(b)));
        })
      );
    });
  });

  describe("extractKeys", () => {
    it("should extract keys that are inside the object", () => {
      const baseObject = {
        keyInList1: "value1",
        keyInList2: "value2",
        keyNotInList1: "valueNot1"
      };

      const keys = ["keyInList1", "keyInList2", "keyNotInObject"];

      expect(extractKeys(keys, baseObject)).toEqual({
        keyInList1: "value1",
        keyInList2: "value2"
      });
    });
  });

  describe("copy", () => {
    it("should create a new object", () => {
      fc.assert(
        fc.property(fc.object(), (obj: any) => {
          expect(copy(obj)).not.toBe(obj);
        })
      );
    });

    it("should create the same object", () => {
      fc.assert(
        fc.property(fc.object(), (obj: any) => {
          expect(copy(obj)).toEqual(obj);
        })
      );
    });
  });

  describe("removeKey", () => {
    it("should remove the key", () => {
      fc.assert(
        fc.property(
          fc.object(),
          fc.string(),
          fc.anything(),
          (obj: any, key, value) => {
            expect(removeKey({ ...obj, [key]: value }, key)).toEqual(
              removeKey(obj, key)
            );
          }
        )
      );
    });

    it("should not modify the original object", () => {
      fc.assert(
        fc.property(fc.object(), fc.string(), (obj: any, key) => {
          const backup = copy(obj);
          removeKey(obj, key);
          expect(obj).toEqual(backup);
        })
      );
    });
  });
});
