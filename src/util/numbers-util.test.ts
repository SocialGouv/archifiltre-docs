import { curriedFormatPercent, formatPercent, percent } from "./numbers-util";

describe("numbers-util", () => {
  describe("percent", () => {
    describe("with default numbersOfDecimals", () => {
      describe("with a value rounded down", () => {
        it("should return a rounded value", () => {
          expect(percent(1, 3)).toEqual(33);
        });
      });

      describe("with a value rounded up", () => {
        it("should return a rounded value", () => {
          expect(percent(2, 3)).toEqual(67);
        });
      });
    });

    describe("with a set numbersOfDecimals", () => {
      describe("with a value rounded down", () => {
        it("should return a rounded value", () => {
          expect(percent(1, 3, { numbersOfDecimals: 2 })).toEqual(33.33);
        });
      });

      describe("with a value rounded up", () => {
        it("should return a rounded value", () => {
          expect(percent(2, 3, { numbersOfDecimals: 2 })).toEqual(66.67);
        });
      });
    });
  });

  describe("formatPercent", () => {
    it("with default value", () => {
      expect(formatPercent(1 / 3)).toBe(33);
    });

    it("with set number of decimals", () => {
      expect(formatPercent(1 / 3, { numbersOfDecimals: 2 })).toBe(33.33);
    });
  });

  describe("curriedFormatPercent", () => {
    it("with set number of decimals", () => {
      expect(curriedFormatPercent({ numbersOfDecimals: 2 })(1 / 3)).toBe(33.33);
    });
  });
});
