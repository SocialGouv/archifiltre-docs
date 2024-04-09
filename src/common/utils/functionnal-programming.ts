export type Mapper<TInput, TOutput> = (input: TInput) => TOutput;
export type Merger<TInput1, TInput2, TOutput> = (input1: TInput1, input2: TInput2) => TOutput;

export type Accessor<T> = () => T;

/**
 * Applies the ! operator to the value
 */
export const not = (value: boolean): boolean => !value;

/**
 * Returns the size of an array. Basically, array.length wrapped in a function.
 */
export const size = (arrayOrString: unknown[] | string): number => arrayOrString.length;

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
export const tap =
  <T>(sideEffect: Mapper<T, void>): Mapper<T, T> =>
  (value: T) => {
    sideEffect(value);
    return value;
  };
