/**
 * Composes objects
 * @param mergedObject - Object to merge into the base object
 * @param baseObject - Base object
 */
export const compose = <T1, T2>(mergedObject: T1, baseObject: T2): T1 & T2 => ({
  ...baseObject,
  ...mergedObject,
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
export const extractKeys = <T extends SimpleObject, TKeys extends keyof T>(
  keys: TKeys[],
  obj: T
): Pick<T, TKeys> => {
  return keys.reduce((ans, key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      return { ...ans, [key]: obj[key] };
    }
    return ans;
  }, {}) as Pick<T, TKeys>;
};

/**
 * Creates a copy of an object
 */
export const copy = <T extends SimpleObject>(a: T): T => ({ ...a });

/**
 * To use instead of `object` or `{}`.
 */
export type SimpleObject<T = unknown> = Record<string, T | undefined>;
