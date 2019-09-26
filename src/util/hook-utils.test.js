import { hookCounter } from "./hook-utils";
import { advanceBy, advanceTo } from "jest-date-mock";

const setup = options => {
  const throttledHook = jest.fn();
  const { hook, getCount } = hookCounter(throttledHook, options);
  advanceTo(new Date());
  return {
    throttledHook,
    hook,
    getCount
  };
};

describe("hookUtils", () => {
  describe("hookCounter", () => {
    describe("with default interval", () => {
      it("should debounce correctly", () => {
        const { hook, throttledHook } = setup();
        hook();
        advanceBy(200);
        hook();
        expect(throttledHook).not.toBeCalled();
        advanceBy(400);
        hook();
        expect(throttledHook).toBeCalledTimes(1);
        expect(throttledHook).toBeCalledWith(3);
      });
    });

    describe("with custom interval", () => {
      it("should debounce correctly", () => {
        const { hook, throttledHook } = setup({
          interval: 300
        });
        hook();
        advanceBy(200);
        hook();
        advanceBy(200);
        hook();
        expect(throttledHook).toBeCalledTimes(1);
        expect(throttledHook).toBeCalledWith(3);
      });
    });
  });
});
