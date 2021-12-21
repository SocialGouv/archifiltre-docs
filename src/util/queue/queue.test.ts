import { tap } from "rxjs/operators";

import { computeQueue } from "./queue";

describe("queue", () => {
  describe("computeQueue", () => {
    it("should handle a queue computation", async () => {
      const queue = ["result1", "result2", "error"];
      interface Error {
        type: "error";
      }
      interface Result {
        type: "result";
        value: string;
      }

      const error = (): Error => ({ type: "error" });
      const result = (value: string): Result => ({
        type: "result",
        value,
      });

      const valueComputer = async (
        values: string[]
      ): Promise<(Error | Result)[]> =>
        Promise.all(
          values.map(async (value) =>
            Promise.resolve(value === "error" ? error() : result(value))
          )
        );

      const isResult = (value: Error | Result): value is Result =>
        value.type === "result";

      const queueComputer = computeQueue(valueComputer, isResult);

      const emitted = [];

      await queueComputer(queue)
        .pipe(tap((val) => emitted.push(val)))
        .toPromise();

      expect(emitted).toEqual([
        {
          remaining: [],
          results: [result("result1"), result("result2")],
        },
      ]);
    });
  });
});
