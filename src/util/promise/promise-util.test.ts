import { liftPromise } from "util/promise/promise-util";

describe("promise-util", () => {
  describe("liftPromise", () => {
    it("should work with resolved promise", async () => {
      const double = (num: number) => num * 2;
      const liftedDouble = liftPromise(double);

      const result = await liftedDouble(Promise.resolve(10));

      expect(result).toEqual(20);
    });

    it("should work with rejected promise", async () => {
      const double = (num: number) => num * 2;
      const liftedDouble = liftPromise(double);

      await expect(liftedDouble(Promise.reject("Error"))).rejects.toEqual(
        "Error"
      );
    });
  });
});
