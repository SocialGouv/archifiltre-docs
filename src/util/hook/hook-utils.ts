type InternalHook<HookArgs extends any[]> = (...args: HookArgs) => boolean;
type Hook<HookArgs extends any[]> = (count?: number, ...args: HookArgs) => void;
type ResultHook<HookArgs extends any[]> = (...args: HookArgs) => void;

export interface HookCounterOptions<HookArgs extends any[]> {
  interval?: number;
  internalHook: InternalHook<HookArgs> | InternalHook<[]>;
}

interface HookCounterResult<HookArgs extends any[]> {
  hook: ResultHook<HookArgs>;
  getCount: () => number;
}

/**
 * Counts the number of calls done to the hook function. Throttles it to avoid too many calls.
 * @param {function} throttledHook - A function that will be called at most one time every interval ms
 * @param {number} interval - The interval between each call.
 * @param {function} internalHook - a hook called on each trigger. Should return true to count the call.
 * @returns {{hook: hook, getCount: (function(): number)}} - The hook to count calls and a function that return the
 * current number of times the hook has been called
 */
export const hookCounter = <HookArgs extends []>(
  throttledHook: Hook<HookArgs>,
  { interval = 500, internalHook = () => true }: HookCounterOptions<any> = {
    interval: 500,
    internalHook: () => true,
  }
): HookCounterResult<HookArgs> => {
  let count = 0;
  let lastCall = Date.now();

  const hook = (...args: HookArgs) => {
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
    hook,
    getCount: () => count,
  };
};
