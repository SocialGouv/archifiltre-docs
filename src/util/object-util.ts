/**
 * Composes objects
 * @param mergedObject - Object to merge into the base object
 * @param baseObject - Base object
 */
export const compose = (mergedObject: object, baseObject: object): object => ({
  ...baseObject,
  ...mergedObject
});

/**
 * Creates an object containing the specifies keys
 * @param keys - Keys to extract from object
 * @param obj - The object to extract keys from
 * @example
 * const keys = ["inObj", "inObj2", "notInObj"];
 * const obj = {
 *     inObj: "value1",
 *     inObj2: "value2",
 *     notExtracted: "value3"
 * }
 * extractKeys(keys, obj)
 * // { inObj: "value1", inObj2: "value2" }
 */
export const extractKeys = <U>(keys: string[], obj: { [key: string]: U }) => {
  return keys.reduce((ans, key) => {
    if (obj.hasOwnProperty(key)) {
      return { ...ans, [key]: obj[key] };
    }
    return ans;
  }, {});
};

/**
 * Creates a copy of an object
 * @param a
 */
export const copy = (a: object): object => ({ ...a });

/**
 * Create a new object with the key removed
 * @param object - the object to remove the key from
 * @param key - the key to remove
 */
export const removeKey = (
  { [key]: _, ...rest }: { [s: string]: any },
  key: any
) => ({
  ...rest
});
