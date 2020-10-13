import { version } from "../package.json";

/**
 * Compares two versions with the format MAJOR.MINOR.PATCH
 * @param firstVersion is the first version number to compare
 * @param secondVersion is the second version number to compare
 * @returns {number} returns 0 if versions are equal, 1 if firstVersion > secondVersion, and -1 if secondVersion > firstVersion
 */
export const versionComparator = (
  firstVersion: string,
  secondVersion: string
): number => {
  const firstVersionDigits = firstVersion.split(".");
  const secondVersionDigits = secondVersion.split(".");
  for (let i = 0; i <= 2; i++) {
    const firstVersionDigit = +firstVersionDigits[i] || 0;
    const secondVersionDigit = +secondVersionDigits[i] || 0;
    if (firstVersionDigit > secondVersionDigit) {
      return 1;
    }
    if (firstVersionDigit < secondVersionDigit) {
      return -1;
    }
  }
  return 0;
};

export const versionName = "Queer Quetzal";

export default version;
