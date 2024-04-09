import { compareSegments } from "./compareSegments";

/**
 * Compares two version strings with the format MAJOR.MINOR.PATCH.
 *
 * @param firstVersion The first version number to compare.
 * @param secondVersion The second version number to compare.
 * @returns Returns 0 if versions are equal, 1 if firstVersion is greater,
 * and -1 if secondVersion is greater.
 */
export const versionComparator = (firstVersion: string, secondVersion: string): number => {
  const firstVersionSegments = firstVersion.split(".").map(Number);
  const secondVersionSegments = secondVersion.split(".").map(Number);

  return compareSegments(firstVersionSegments, secondVersionSegments);
};
