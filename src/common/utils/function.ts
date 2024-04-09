export const identity = <T>(param: T): T => param;

export type AnyFunction = (...args: unknown[]) => unknown;
export type Awaitable<T> = T extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : Promise<T>;
export type VoidFunction = (...args: unknown[]) => void;
