export const identity = <T>(param: T): T => param;

export type AnyFunction = (...args: unknown[]) => unknown;
export type EveryFunction = (...args: unknown[]) => unknown;
export type Awaitable<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => Promise<R>
  : Promise<T>;
export type VoidFunction = (...args: unknown[]) => void;

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
export function compose(...funcs: AnyFunction[]): AnyFunction {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}

type Curry<TFunc extends EveryFunction> = TFunc extends (
  ...args: [infer FirstArg, ...infer RestArgs]
) => infer Ret
  ? RestArgs["length"] extends 0
    ? TFunc
    : (
        param: FirstArg
      ) => RestArgs["length"] extends 1
        ? (...restArgs: RestArgs) => Ret
        : Curry<(...args: RestArgs) => Ret>
  : never;

type PartialTuple<
  TTuple extends unknown[],
  TExtracted extends unknown[] = []
> = TTuple extends [infer FirstParam, ...infer RestParam]
  ? PartialTuple<RestParam, [...TExtracted, FirstParam?]>
  : [...TExtracted, ...TTuple];

type PartialParameters<TFunc extends (...args: unknown[]) => unknown> =
  PartialTuple<Parameters<TFunc>>;

/**
 * Currify a given function with multiple parameters.
 *
 * Because of TypeScript limitations on keeping labels of named tuples manipulations,
 * only the last param name is kept for autocomplete.
 *
 * @example ```ts
 * declare const fn: (a: number, b: string, c: boolean) => Date;
 * const curryFn = curry(fn); // (param: number) => (param: string) => (c: boolean) => Date
 * ```
 */
export function curry<TFunc extends EveryFunction>(
  fn: TFunc,
  ...inputArgs: PartialParameters<TFunc>
): Curry<TFunc> {
  return ((...args: PartialParameters<TFunc>) => {
    const totalArgs = [...inputArgs, ...args] as PartialParameters<TFunc>;
    if (totalArgs.length >= fn.length) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return fn(...totalArgs);
    }
    return curry(fn, ...totalArgs);
  }) as unknown as Curry<TFunc>;
}
