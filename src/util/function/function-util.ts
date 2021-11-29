export const identity = <T>(param: T): T => param;

export type AnyFunction = (...args: unknown[]) => unknown;
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return funcs[0]!;
    }

    return funcs.reduce(
        (a, b) =>
            (...args) =>
                a(b(...args))
    );
}
