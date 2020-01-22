import fc from "fast-check";
import { epochToFormattedUtcDateString } from "./csv";

describe("csv", () => {
  describe("epochToFormattedUtcDateString", () => {
    it("should correctly format dates", () => {
      fc.assert(
        fc.property(
          fc.integer(1, 28),
          fc.integer(0, 11),
          fc.integer(1971, 2071),
          (day, month, year) => {
            const date = Date.UTC(year, month, day);
            const paddedDay = `0${day}`.slice(-2);
            const paddedMonth = `0${month + 1}`.slice(-2);
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
