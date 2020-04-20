import { compose } from "./function-util";

describe("function-util", () => {
  describe("compose", () => {
    it("should compose functions", () => {
      const firstFunction = (value) => value + ":first";
      const secondFunction = (value) => value + ":second";

      const composed = compose(secondFunction, firstFunction);

      expect(composed("base")).toBe("base:first:second");
    });
  });
});
