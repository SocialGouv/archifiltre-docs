/**
 * Create a comparator function to sort on an object field.
 * @param key
 */
export const makeObjectKeyComparator = <T>(key: keyof T) => (
  firstElement: T,
  secondElement: T
): number => {
  const firstCompared = firstElement[key];
  const secondCompared = secondElement[key];

  if (firstCompared === secondCompared) {
    return 0;
  }

  return firstCompared > secondCompared ? 1 : -1;
};
