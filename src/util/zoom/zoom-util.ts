import { boundNumber } from "../numbers/numbers-util";
import { round } from "lodash";

export enum ZoomDirection {
  IN,
  OUT,
}

type ZoomState = {
  ratio: number;
  offset: number;
};

type ZoomAction = {
  mousePosition: number;
  zoomDirection: ZoomDirection;
};

const getZoomPower = (zoomDirection: ZoomDirection) =>
  zoomDirection === ZoomDirection.IN ? 1 : -1;

export const computeZoomRatio = (
  zoomRatio: number,
  zoomSpeed: number,
  zoomDirection: ZoomDirection
) => Math.max(zoomRatio * zoomSpeed ** getZoomPower(zoomDirection), 1);

export const computeOffset = (
  mousePosition: number,
  zoomRatio: number,
  newZoomRatio: number,
  zoomOffset: number,
  viewBoxWidth: number
) => {
  const offset =
    mousePosition - (zoomRatio / newZoomRatio) * (mousePosition - zoomOffset);

  return round(boundNumber(0, (1 - 1 / newZoomRatio) * viewBoxWidth, offset));
};

export const makeZoomReducer = (zoomSpeed: number, viewBoxWidth: number) => (
  { ratio, offset }: ZoomState,
  { mousePosition, zoomDirection }: ZoomAction
): ZoomState => {
  const nextRatio = computeZoomRatio(ratio, zoomSpeed, zoomDirection);
  const nextOffset = computeOffset(
    mousePosition,
    ratio,
    nextRatio,
    offset,
    viewBoxWidth
  );
  return {
    ratio: nextRatio,
    offset: nextOffset,
  };
};
