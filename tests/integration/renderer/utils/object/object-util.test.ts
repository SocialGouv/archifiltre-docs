import { copy, extractKeys } from "@common/utils/object";
import fc from "fast-check";

describe("object-utils", () => {
  describe("extractKeys", () => {
    it("should extract keys that are inside the object", () => {
      const baseObject = {
        keyInList1: "value1",
        keyInList2: "value2",
        keyNotInList1: "valueNot1",
      };

      const keys = ["keyInList1", "keyInList2", "keyNotInObject"];

      expect(
        extractKeys(keys as (keyof typeof baseObject)[], baseObject)
      ).toEqual({
        keyInList1: "value1",
        keyInList2: "value2",
      });
    });
  });

  describe("copy", () => {
    it("should create a new object", () => {
      fc.assert(
        fc.property(fc.object(), (obj) => {
          expect(copy(obj)).not.toBe(obj);
        })
      );
    });

    it("should create the same object", () => {
      fc.assert(
        fc.property(fc.object(), (obj) => {
          expect(copy(obj)).toEqual(obj);
        })
      );
    });
  });
});
