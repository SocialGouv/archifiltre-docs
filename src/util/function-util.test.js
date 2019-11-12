import { compose } from "./function-util";

describe("functionUtil", () => {
  describe("compose", () => {
    it("should compose functions", function() {
      const firstFunction = value => value + ":first";
      const secondFunction = value => value + ":second";

      const composed = compose(secondFunction, firstFunction);

      expect(composed("base")).toBe("base:first:second");
    });
  });
});
