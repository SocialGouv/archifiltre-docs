export const curriedToDecimalFloat =
  (decimals: number) =>
  (value: number): number =>
    toDecimalsFloat(value, decimals);

interface RatioOptions {
  max: number;
  min?: number;
}

export const ratio = (value: number, { min = 0, max }: RatioOptions): number => (value - min) / (max - min);

export const boundNumber = (low: number, high: number, value: number): number => Math.max(Math.min(value, high), low);

export const toDecimalsFloat = (n: number, decimals: number): number => {
  const mult = Math.pow(10, decimals);
  return Math.round(n * mult) / mult;
};

export const getPercentage = (current: number, total: number, decimals = 2): number =>
  toDecimalsFloat((current / total) * 100, decimals);

export const bytesToGigabytes = (bytes: number, decimals = 1): number => toDecimalsFloat(bytes / 1.0e9, decimals);

export const bytesToMegabytes = (bytes: number, decimals = 1): number => toDecimalsFloat(bytes / 1.0e6, decimals);

export const bytesToKilobytes = (bytes: number, decimals = 1): number => toDecimalsFloat(bytes / 1000, decimals);
