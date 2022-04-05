import type { AnyFunction } from "@common/utils/function";
import { compose } from "redux";

describe("function-util", () => {
  describe("compose", () => {
    it("should compose functions", () => {
      const firstFunction: AnyFunction = (value) => `${value}:first`;
      const secondFunction: AnyFunction = (value) => `${value}:second`;

      const composed: AnyFunction = compose(secondFunction, firstFunction);

      expect(composed("base")).toBe("base:first:second");
    });
  });
});
