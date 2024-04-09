/**
 * Recursively compares segments of two version arrays.
 *
 * @param v1Segments The segments of the first version as an array of numbers.
 * @param v2Segments The segments of the second version as an array of numbers.
 * @param index The current index being compared.
 * @returns Returns 0 if current segments are equal, 1 if the first segment is greater,
 * and -1 if the second segment is greater.
 */
export const compareSegments = (v1Segments: number[], v2Segments: number[], index = 0): number => {
  if (index >= v1Segments.length && index >= v2Segments.length) {
    return 0;
  }

  const segment1 = v1Segments[index] ?? 0;
  const segment2 = v2Segments[index] ?? 0;

  if (segment1 > segment2) return 1;
  if (segment1 < segment2) return -1;

  return compareSegments(v1Segments, v2Segments, index + 1);
};
