import fc from "fast-check";
import { ff } from "../datastore/files-and-folders";
import { List } from "immutable";

/* Custom arbitraries built on fast-check */

/**
 * Arbitrary past timestamp
 * @type {ArbitraryWithShrink<number>}
 */
export const arbitraryPastTimestamp = fc.integer(0, Date.now());

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

/**
 * Arbitrary immutable.List of strings
 * @type {Arbitrary<List<string>>}
 */
export const arbitraryImmutableList = contentArbitrary =>
  fc.array(contentArbitrary).map(array => List(array));

/**
 * Arbitrary file or folder path
 * @type {Arbitrary<string>}
 */
export const arbitraryPath = fc
  .array(fc.hexaString(1, 40), 1, 10)
  .map(pathElems => `/${pathElems.join("/")}`);

/**
 * Arbitrary "origin"
 * @type {Arbitrary<*[]>}
 */
export const arbitraryOrigin = fc
  .tuple(fc.nat(), arbitraryPastTimestamp, arbitraryPath)
  .map(([size, lastModified, path]) => [
    {
      size,
      lastModified
    },
    path
  ]);

/**
 * A list of arbitrary origins
 * @type {Arbitrary<*[][]>}
 */
export const arbitraryOrigins = fc.set(
  arbitraryOrigin,
  1,
  10,
  ([, pathA], [, pathB]) => pathA === pathB
);

/**
 * Arbitrary fileAndFolders structures
 * @type {Arbitrary<unknown>}
 */
export const arbitraryFF = arbitraryOrigins.map(origin => ff(origin));
