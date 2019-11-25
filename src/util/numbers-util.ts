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
): number => {
  const exponent = 10 ** numbersOfDecimals;
  return Math.round((value / total) * 100 * exponent) / exponent;
};
