import { curryRight } from "lodash";
import { curry } from "lodash/fp";

/**
 * Get a percent value rounded to the right number of decimals
 * @param value - The numerator count
 * @param total - The denominator count
 * @param numbersOfDecimals - The number of displayed decimals
 * @returns {string}
 */
export const percent = (
  value: number,
  total: number,
  { numbersOfDecimals = 0 } = {}
): number => formatPercent(value / total, { numbersOfDecimals });

/**
 * Format a number to percent
 * @param value - The value
 * @param numbersOfDecimals - The number of decimals required
 * @example
 * formatPercent(1/3, { numberOfDecimals: 2 })
 * // 33.33
 */
export const formatPercent = (
  value: number,
  { numbersOfDecimals = 0 } = {}
) => {
  const exponent = 10 ** numbersOfDecimals;
  return Math.round(value * 100 * exponent) / exponent;
};

/**
 * Curried version of format percent, where first arg is the options.
 */
export const curriedFormatPercent = options => value =>
  formatPercent(value, options);
