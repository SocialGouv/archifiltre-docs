import { fill } from "lodash";

/**
 * Adds cumulatively the values of an array (starting with a 0) without the last element
 * @param array
 * @returns {[number]}
 * @example
 * computeCumulative([1, 1, 1]) // [ 0, 1, 2 ]
 * computeCumulative([1, 2, 3]) // [ 0, 1, 3 ]
 */
export const computeCumulative = array => {
  const ans = [0];
  for (let i = 0; i < array.length - 1; i++) {
    ans.push(array[i] + ans[i]);
  }
  return ans;
};

/**
 * Creates an array with nbElements which are initialized to defaultValue
 * @param nbElements
 * @param [defaultValue=undefined] - Default
 * @returns {any[][]}
 */
export const makeEmptyArray = (nbElements, defaultValue) =>
  fill(Array(nbElements), defaultValue);

/**
 * Replaces the value from array at index by the newValue.
 * @param array - The array to work on
 * @param index - The index of the value to replace
 * @param newValue - The value to replace the old one with
 * @returns {*[]} - A new array with the replaced value
 */
export const replaceValue = (array, index, newValue) => [
  ...array.slice(0, index),
  newValue,
  ...array.slice(index + 1)
];

/**
 * Curried function that counts the number of items in array for which predicate is true
 * @param predicate - A function called with an array element that returns true if predicate matches
 * @param array - The array to count elements from
 * @returns {function(*): *}
 */
export const countItems = predicate => array => array.filter(predicate).length;

/**
 * Returns the median of a sorted array of numbers
 * @param sortedArray - An already sorted array of numbers
 * @returns {number|*}
 */
export const medianOnSortedArray = sortedArray => {
  const arrayLength = sortedArray.length;
  if (arrayLength % 2 === 1) {
    return sortedArray[(arrayLength - 1) / 2];
  }

  return (sortedArray[arrayLength / 2] + sortedArray[arrayLength / 2 - 1]) / 2;
};

export const empty = [];
