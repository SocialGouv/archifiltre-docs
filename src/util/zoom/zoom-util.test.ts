import { computeZoomRatio, makeZoomReducer, ZoomDirection } from "./zoom-util";
import fc from "fast-check";
import _ from "lodash";

describe("zoom-util", () => {
  describe("computeZoomRatio", () => {
    it("should return a greater value when zooming in", () => {
      expect(computeZoomRatio(1, 1.1, ZoomDirection.IN)).toBe(1.1);
    });
    it("should return a lower value when zooming out", () => {
      expect(computeZoomRatio(1.1, 1.1, ZoomDirection.OUT)).toBe(1);
    });
  });
  describe("makeZoomReducer", () => {
    it("should preserve the state when zoom in and zoom out on the same position", () => {
      const viewboxWidth = 1000;
      const precision = viewboxWidth / 100;
      const maxZooms = 10;
      const zoomReducer = makeZoomReducer(1.1, viewboxWidth);
      const arbitraryState = fc
        .integer(1, 1000)
        .chain((ratio) =>
          fc.tuple(
            fc.constant(ratio),
            fc.integer(0, viewboxWidth - viewboxWidth / ratio)
          )
        )
        .chain(([ratio, offset]) =>
          fc.tuple(
            fc.constant(ratio),
            fc.constant(offset),
            fc.integer(offset, offset + viewboxWidth / ratio),
            fc.nat(maxZooms)
          )
        );
      fc.assert(
        fc.property(
          arbitraryState,
          ([ratio, offset, mousePosition, numberOfZooms]) => {
            const zoomIns = _.range(numberOfZooms).map(() => ({
              mousePosition,
              zoomDirection: ZoomDirection.IN,
            }));

            const zoomOuts = _.range(numberOfZooms).map(() => ({
              mousePosition,
              zoomDirection: ZoomDirection.OUT,
            }));

            const zoomInsState = zoomIns.reduce(zoomReducer, { ratio, offset });

            const finalState = zoomOuts.reduce(zoomReducer, zoomInsState);

            const isRatioOk =
              ratio - precision < finalState.ratio &&
              ratio + precision > finalState.ratio;
            const isOffsetOk =
              offset - precision < finalState.offset &&
              offset + precision > finalState.offset;

            return isRatioOk && isOffsetOk;
          }
        )
      );
    });
  });
});
