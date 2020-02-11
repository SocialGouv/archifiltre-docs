import { v13JsToV14Js, v2ToV21Js } from "./compatibility";
import v13 from "./v13file.json";
import v14 from "./v14file.json";
import v21 from "./v2.1file.json";
import v2 from "./v2file.json";

describe("compatibility", () => {
  describe("v13JstoV14Js", () => {
    it("should convert it to v14 properly", () => {
      expect(v13JsToV14Js(v13)).toEqual(v14);
    });
  });

  describe("v2ToV21JS", () => {
    it("should convert v2 file to v2.1 file", () => {
      expect(v2ToV21Js(v2)).toEqual(v21);
    });
  });
});
