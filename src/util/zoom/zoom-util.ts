import { boundNumber } from "../numbers/numbers-util";

export enum ZoomDirection {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  IN = 0,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  OUT = 1,
}

interface ZoomState {
  ratio: number;
  offset: number;
}

interface ZoomAction {
  mousePosition: number;
  zoomDirection: ZoomDirection;
  zoomSpeed: number;
}

const getZoomPower = (zoomDirection: ZoomDirection) =>
  zoomDirection === ZoomDirection.IN ? 1 : -1;

export const computeZoomRatio = (
  zoomRatio: number,
  zoomSpeed: number,
  zoomDirection: ZoomDirection
): number => Math.max(zoomRatio * zoomSpeed ** getZoomPower(zoomDirection), 1);

export const computeOffset = (
  mousePosition: number,
  zoomRatio: number,
  newZoomRatio: number,
  zoomOffset: number
): number => {
  const offset =
    mousePosition - (zoomRatio / newZoomRatio) * (mousePosition - zoomOffset);

  return boundNumber(0, 1 - 1 / newZoomRatio, offset);
};

export const zoomReducer = (
  { ratio, offset }: ZoomState,
  { mousePosition, zoomDirection, zoomSpeed }: ZoomAction
): ZoomState => {
  const nextRatio = computeZoomRatio(ratio, zoomSpeed, zoomDirection);
  const nextOffset = computeOffset(mousePosition, ratio, nextRatio, offset);
  return {
    offset: nextOffset,
    ratio: nextRatio,
  };
};
