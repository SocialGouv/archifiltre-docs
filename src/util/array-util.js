export const zip = a => {
  return a[0].map((_, i) => a.map(a => a[i]));
};

export const unzip = zip;

export const join = a => {
  return a.reduce((acc, val) => acc.concat(val), []);
};

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
  Array.apply(null, Array(nbElements)).map(() => defaultValue);

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

export const empty = [];
