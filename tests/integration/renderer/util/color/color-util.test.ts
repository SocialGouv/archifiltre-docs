import { arbitraryRgba } from "@renderer/test/custom-arbitraries";
import { fromRgba, toRgba } from "@renderer/util/color/color-util";
import equal from "deep-equal";
import fc from "fast-check";

describe("color", () => {
  // eslint-disable-next-line jest/expect-expect -- fc assert
  it("(fromRgba . toRgba) a", () => {
    fc.assert(
      fc.property(arbitraryRgba, (color) =>
        equal(color, fromRgba(toRgba(color)))
      )
    );
  });
});
