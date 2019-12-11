import { v13JsToV14Js } from "./compatibility";
import v13 from "./v13file.json";
import v14 from "./v14file.json";

describe("compatibility", () => {
  describe("v13JstoV14Js", () => {
    it("should convert it to v14 properly", () => {
      expect(v13JsToV14Js(v13)).toEqual(v14);
    });
  });
});
