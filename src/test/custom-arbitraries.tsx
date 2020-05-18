import fc from "fast-check";

/* Custom arbitraries built on fast-check */

/**
 * Arbitrary byte value
 * @type {ArbitraryWithShrink<number>}
 */
export const arbitraryByte = fc.integer(0, 255);

/**
 * Arbitrary RGBA color
 * @type {Arbitrary<[number, number, number, number]>}
 */
export const arbitraryRgba = fc.tuple(
  arbitraryByte,
  arbitraryByte,
  arbitraryByte,
  fc.float(0, 1)
);
