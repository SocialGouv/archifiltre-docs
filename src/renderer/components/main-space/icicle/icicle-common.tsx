import { sum } from "lodash";

export const VIEWBOX_WIDTH = 1000;
export const VIEWBOX_HEIGHT = 300;

/**
 * Returns the array of widths divided by the sum of the widths.
 * @param widths - the widths to normalize
 */
export const normalizeWidth = (widths: number[]) => {
  const totalWidth = sum(widths);
  return widths.map((a) => a / totalWidth);
};
