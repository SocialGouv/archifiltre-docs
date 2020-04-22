import equal from "deep-equal";
import fc from "fast-check";
import { fromRgba, toRgba } from "./color-util";
import { arbitraryRgba } from "../../test/custom-arbitraries";

describe("color", () => {
  it("(fromRgba . toRgba) a", () => {
    fc.assert(
      fc.property(arbitraryRgba, (color: number[]) =>
        equal(color, fromRgba(toRgba(color)))
      )
    );
  });
});
