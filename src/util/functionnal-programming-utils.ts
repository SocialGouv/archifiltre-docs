export type Mapper<Input, Output> = (input: Input) => Output;

export type Accessor<T> = () => T;

/**
 * Applies the ! operator to the value
 * @param value
 */
export const not = (value: boolean): boolean => !value;

/**
 * Returns the size of an array. Basically, array.length wrapped in a function.
 * @param array
 */
export const size = (array: any[] | string): number => array.length;

/**
 * Function that applies a side effect and returns the value. It can be pretty useful to add logs.
 * @param sideEffect
 * @example
 * const fnWithLog = compose([
 *   sortBy("id"),
 *   tap(console.log),
 *   filter(({ id }) => id !== "")
 * ]);
 */
export const tap = <T>(sideEffect: Mapper<T, void>): Mapper<T, T> => (
  value: T
) => {
  sideEffect(value);
  return value;
};
