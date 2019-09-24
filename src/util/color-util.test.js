import equal from "deep-equal";
import fc from "fast-check";
import { fromRgba, toRgba, fromHex, toHex, setAlpha } from "./color-util";
import { arbitraryRgba } from "../test/custom-arbitraries";

describe("color", function() {
  it("(fromRgba . toRgba) a", () => {
    fc.assert(
      fc.property(arbitraryRgba, color => equal(color, fromRgba(toRgba(color))))
    );
  });

  it("(fromHex . toHex) a", () => {
    fc.assert(
      fc.property(arbitraryRgba, color =>
        equal(setAlpha(1, color), fromHex(toHex(color)))
      )
    );
  });
});
