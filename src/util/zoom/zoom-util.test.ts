import { computeZoomRatio, ZoomDirection, zoomReducer } from "./zoom-util";
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
  describe("zoomReducer", () => {
    it("should preserve the state when zoom in and zoom out on the same position", () => {
      const precision = 1 / 100;
      const maxZooms = 10;
      const zoomSpeed = 1.1;
      const arbitraryState = fc
        .integer(1, 1000)
        .chain((ratio) =>
          fc.tuple(fc.constant(ratio), fc.float(0, 1 - 1 / ratio))
        )
        .chain(([ratio, offset]) =>
          fc.tuple(
            fc.constant(ratio),
            fc.constant(offset),
            fc.float(offset, offset + 1 / ratio),
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
              zoomSpeed,
            }));

            const zoomOuts = _.range(numberOfZooms).map(() => ({
              mousePosition,
              zoomDirection: ZoomDirection.OUT,
              zoomSpeed,
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
