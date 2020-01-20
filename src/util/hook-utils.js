/**
 * Counts the number of calls done to the hook function. Throttles it to avoid too many calls.
 * @param {function} throttledHook - A function that will be called at most one time every interval ms
 * @param {number} interval - The interval between each call.
 * @param {function} internalHook - a hook called on each trigger. Should return true to count the call.
 * @returns {{hook: hook, getCount: (function(): number)}} - The hook to count calls and a function that return the
 * current number of times the hook has been called
 */
export const hookCounter = (
  throttledHook,
  { interval = 500, internalHook = () => true } = {}
) => {
  let count = 0;
  let lastCall = Date.now();

  const hook = (...args) => {
    if (internalHook(...args) !== false) {
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
    getCount: () => count
  };
};
