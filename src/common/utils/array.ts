import _, { fill } from "lodash";

import { type FilterMethod } from "./type";

/**
 * Adds cumulatively the values of an array (starting with a 0) without the last element
 * @example
 * computeCumulative([1, 1, 1]) // [ 0, 1, 2 ]
 * computeCumulative([1, 2, 3]) // [ 0, 1, 3 ]
 */
export const computeCumulative = (array: number[]): number[] => {
  const ans = [0];
  for (let i = 0; i < array.length - 1; i++) {
    ans.push((array[i] ?? 0) + (ans[i] ?? 0));
  }
  return ans;
};

/**
 * Creates an array with nbElements which are initialized to defaultValue
 * @param nbElements
 * @param [defaultValue=undefined] - Default
 */
export const makeEmptyArray = <T>(nbElements: number, defaultValue: T): T[] => fill(Array(nbElements), defaultValue);

/**
 * Replaces the value from array at index by the newValue.
 * @param array - The array to work on
 * @param index - The index of the value to replace
 * @param newValue - The value to replace the old one with
 * @returns {*[]} - A new array with the replaced value
 */
export const replaceValue = <T>(array: T[], index: number, newValue: T): T[] => [
  ...array.slice(0, index),
  newValue,
  ...array.slice(index + 1),
];

/**
 * Curried function that counts the number of items in array for which predicate is true
 * @param predicate - A function called with an array element that returns true if predicate matches
 * @param array - The array to count elements from
 * @returns {function(*): *}
 */
export const countItems =
  <T, TArray extends T[] = T[]>(predicate: Parameters<TArray["filter"]>[0]) =>
  (array: TArray): number =>
    array.filter(predicate).length;

/**
 * Returns the median of a sorted array of numbers
 * @param sortedArray - An already sorted array of numbers
 * @returns {number|*}
 */
export const medianOnSortedArray = (sortedArray: number[]): number => {
  const arrayLength = sortedArray.length;
  if (arrayLength % 2 === 1) {
    return sortedArray[(arrayLength - 1) / 2] ?? 0;
  }

  return ((sortedArray[arrayLength / 2] ?? 0) + (sortedArray[arrayLength / 2 - 1] ?? 0)) / 2;
};

export enum BooleanOperator {
  AND = 0,

  OR = 1,
}

const methodByOperator = {
  [BooleanOperator.AND]: _.every.bind(null),
  [BooleanOperator.OR]: _.some.bind(null),
};

/**
 * Apply a list of filters to an array
 * @param array to be filtered
 * @param filters to be applied
 * @param booleanOperator to join the filters
 */
export const applyFiltersList = <T>(
  array: T[],
  filters: Array<FilterMethod<T>>,
  booleanOperator: BooleanOperator = BooleanOperator.AND,
): T[] => array.filter(joinFilters(filters, booleanOperator));

/**
 * Merges filters using a boolean operator
 * @param filters to be applied
 * @param booleanOperator to join the filters
 */
export const joinFilters = <T>(
  filters: Array<FilterMethod<T>>,
  booleanOperator: BooleanOperator = BooleanOperator.AND,
): FilterMethod<T> => {
  if (filters.length === 0) {
    return () => true;
  }
  return (element: T): boolean =>
    methodByOperator[booleanOperator](filters, (filter: FilterMethod<T>) => filter(element));
};

export const empty = [];
