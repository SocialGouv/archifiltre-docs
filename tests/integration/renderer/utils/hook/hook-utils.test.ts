import type { HookCounterOptions } from "@renderer/utils/hook";
import { hookCounter } from "@renderer/utils/hook";
import { advanceBy, advanceTo } from "jest-date-mock";

const setup = (options: HookCounterOptions<unknown[]>) => {
  const throttledHook = jest.fn();
  const { hook, getCount } = hookCounter(throttledHook, options);
  advanceTo(new Date());
  return {
    getCount,
    hook,
    throttledHook,
  };
};

describe("hookUtils", () => {
  describe("hookCounter", () => {
    describe("with default interval", () => {
      it("should debounce correctly", () => {
        const { hook, throttledHook } = setup({
          internalHook: () => true,
        });
        hook();
        advanceBy(200);
        hook();
        expect(throttledHook).not.toHaveBeenCalled();
        advanceBy(400);
        hook();
        expect(throttledHook).toHaveBeenCalledTimes(1);
        expect(throttledHook).toHaveBeenCalledWith(3);
      });
    });

    describe("with custom interval", () => {
      it("should debounce correctly", () => {
        const { hook, throttledHook } = setup({
          internalHook: () => true,
          interval: 300,
        });
        hook();
        advanceBy(200);
        hook();
        advanceBy(200);
        hook();
        expect(throttledHook).toHaveBeenCalledTimes(1);
        expect(throttledHook).toHaveBeenCalledWith(3);
      });
    });
  });
});
