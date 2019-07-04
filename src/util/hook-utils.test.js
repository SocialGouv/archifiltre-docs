import sinon from "sinon";
import chai from "chai";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

const { expect } = chai;

import { hookCounter } from "./hook-utils";

describe("hookUtils", () => {
  describe("hookCounter", () => {
    let clock;
    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });
    describe("with default interval", () => {
      it("should debounce correctly", () => {
        const throttledHook = sinon.spy();
        const { hook, getCount } = hookCounter(throttledHook);
        hook();
        clock.tick(200);
        hook();
        expect(throttledHook).to.have.not.been.called;
        clock.tick(400);
        hook();
        expect(throttledHook).to.have.been.calledOnce;
        expect(throttledHook).to.have.been.calledWith(3);
      });
    });

    describe("with custom interval", () => {
      it("should debounce correctly", () => {
        const throttledHook = sinon.spy();
        const { hook, getCount } = hookCounter(throttledHook, {
          interval: 300
        });
        hook();
        clock.tick(200);
        hook();
        clock.tick(200);
        hook();
        expect(throttledHook).to.have.been.calledOnce;
        expect(throttledHook).to.have.been.calledWith(3);
      });
    });
  });
});
