import equal from "deep-equal";
import fc from "fast-check";
import { arbitraryImmutableList } from "./test/custom-arbitraries";
import {
  line2List,
  list2Line,
  fromStr,
  toStr,
  leftPadInt,
  epochToFormattedUtcDateString
} from "csv";

describe("csv", function() {
  describe("(line2List . list2Line)", () => {
    it("should be an identity function", () => {
      fc.assert(
        // TODO : fix line2List not handling ";" inside values (and change fc.hexaString() to fc.string())
        fc.property(arbitraryImmutableList(fc.hexaString()), list =>
          equal(line2List(list2Line(list)).toJS(), list.toJS())
        )
      );
    });
  });

  describe("fromStr . toStr", () => {
    it("should be an identity function", () => {
      fc.assert(
        fc.property(
          // TODO : fix fromStr not handling ";" inside values (and change fc.hexaString() to fc.string())
          arbitraryImmutableList(arbitraryImmutableList(fc.hexaString())),
          list => equal(fromStr(toStr(list)).toJS(), list.toJS())
        )
      );
    });
  });
  describe("leftPadInt", () => {
    it("should behave correctly", () => {
      expect(leftPadInt(0, 12)).toEqual("12");
      expect(leftPadInt(1, 12)).toEqual("12");
      expect(leftPadInt(2, 12)).toEqual("12");
      expect(leftPadInt(3, 12)).toEqual("012");
      expect(leftPadInt(4, 12)).toEqual("0012");
    });

    it("should have a length bigger or equal to the pad value", () => {
      fc.assert(
        fc.property(
          fc.integer(9999),
          fc.integer(0, 6),
          (number, padding) => leftPadInt(padding, number).length >= padding
        )
      );
    });
  });

  describe("epochToFormattedUtcDateString", () => {
    it("should correctly format dates", () => {
      fc.assert(
        fc.property(
          fc.integer(1, 28),
          fc.integer(0, 11),
          fc.integer(1971, 2071),
          (day, month, year) => {
            const date = Date.UTC(year, month, day);
            const paddedDay = leftPadInt(2, day);
            const paddedMonth = leftPadInt(2, month + 1);
            return (
              epochToFormattedUtcDateString(date) ===
              `${paddedDay}/${paddedMonth}/${year}`
            );
          }
        )
      );
    });
  });
});
