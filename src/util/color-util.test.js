import chai from "chai";
const should = chai.should();

import * as Loop from "test/loop";
import * as Arbitrary from "test/arbitrary";
import * as M from "./color-util";

describe("color", function() {
  Loop.equal("(fromRgba . toRgba) a", () => {
    const a = M.arbitrary();
    return [M.fromRgba(M.toRgba(a)), a];
  });

  Loop.equal("(fromHex . toHex) a", () => {
    const a = M.arbitrary();
    return [M.fromHex(M.toHex(a)), M.setAlpha(1, a)];
  });
});
