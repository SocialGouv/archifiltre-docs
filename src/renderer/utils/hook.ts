type InternalHook<THookArgs extends unknown[]> = (
  ...args: THookArgs
) => boolean;
type Hook<THookArgs extends unknown[]> = (
  count?: number,
  ...args: THookArgs
) => void;
type ResultHook<THookArgs extends unknown[]> = (...args: THookArgs) => void;

export interface HookCounterOptions<THookArgs extends unknown[]> {
  internalHook: InternalHook<[]> | InternalHook<THookArgs>;
  interval?: number;
}

interface HookCounterResult<THookArgs extends unknown[]> {
  getCount: () => number;
  hook: ResultHook<THookArgs>;
}

/**
 * Counts the number of calls done to the hook function. Throttles it to avoid too many calls.
 * @param {function} throttledHook - A function that will be called at most one time every interval ms
 * @param {number} interval - The interval between each call.
 * @param {function} internalHook - a hook called on each trigger. Should return true to count the call.
 * @returns {{hook: hook, getCount: (function(): number)}} - The hook to count calls and a function that return the
 * current number of times the hook has been called
 */
export const hookCounter = <THookArgs extends unknown[]>(
  throttledHook: Hook<THookArgs>,
  {
    interval = 500,
    internalHook = () => true,
  }: HookCounterOptions<unknown[]> = {
    internalHook: () => true,
    interval: 500,
  }
): HookCounterResult<THookArgs> => {
  let count = 0;
  let lastCall = Date.now();

  const hook = (...args: THookArgs) => {
    if (internalHook(...args)) {
      count++;
    }

    if (Date.now() - lastCall < interval) {
      return;
    }
    lastCall = Date.now();
    throttledHook(count, ...args);
  };

  return {
    getCount: () => count,
    hook,
  };
};
