import {
  v13JsToV14Js,
  v21ToV22Js,
  v22ToV30Js,
  v2ToV21Js,
} from "./compatibility";
import v13 from "./v13file.json";
import v14 from "./v14file.json";
import v21 from "./v2.1file.json";
import v2 from "./v2file.json";
import v22 from "./v22file.json";
import v30 from "./v30file.json";

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

  describe("v21ToV22Js", () => {
    it("should convert v21 file to v22", () => {
      expect(v21ToV22Js(v21)).toEqual(v22);
    });
  });

  describe("v22ToV30Js", () => {
    it("should convert v21 file to v22", () => {
      expect(v22ToV30Js(v22)).toEqual(v30);
    });
  });
});
