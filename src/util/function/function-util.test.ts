import { AnyFunction, compose } from "./function-util";

describe("function-util", () => {
    describe("compose", () => {
        it("should compose functions", () => {
            const firstFunction: AnyFunction = (value) => `${value}:first`;
            const secondFunction: AnyFunction = (value) => `${value}:second`;

            const composed = compose(secondFunction, firstFunction);

            expect(composed("base")).toBe("base:first:second");
        });
    });
});
