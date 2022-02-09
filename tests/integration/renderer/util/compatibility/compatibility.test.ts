import v21 from "@renderer/util/compatibility/v2.1file.json";
import {
  v2ToV21Js,
  v13JsToV14Js,
  v21ToV22Js,
} from "@renderer/utils/compatibility/compatibility";
import v2 from "@renderer/utils/compatibility/v2file.json";
import v13 from "@renderer/utils/compatibility/v13file.json";
import v14 from "@renderer/utils/compatibility/v14file.json";
import v22 from "@renderer/utils/compatibility/v22file.json";

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
});
