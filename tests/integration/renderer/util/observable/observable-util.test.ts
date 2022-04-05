import type { AnyFunction } from "@common/utils/function";
import { MessageTypes } from "@renderer/utils/batch-process/types";
import type { DataProcessingStream } from "@renderer/utils/observable";
import { operateOnDataProcessingStream } from "@renderer/utils/observable";
import type { OperatorFunction } from "rxjs";
import { identity, of } from "rxjs";
import { map, toArray } from "rxjs/operators";

const resultElement = {
  result: "result",
  type: MessageTypes.RESULT as const,
};

const resultElement2 = {
  result: "result2",
  type: MessageTypes.RESULT as const,
};

const errorElement = {
  error: "error",
  type: MessageTypes.ERROR as const,
};

const streamData = [resultElement, errorElement, resultElement2];

const testStream = (
  stream: DataProcessingStream<unknown>,
  test: AnyFunction
) => {
  return stream.pipe(toArray()).subscribe(test);
};

describe("observable-utl", () => {
  describe("operateOnDataProcessingStream", () => {
    it("should return the same stream with no operators", async () => {
      const resultMapper = jest.fn(identity);
      const baseStream = of(...streamData);

      const testedStream = operateOnDataProcessingStream(baseStream, {
        result: map(resultMapper),
      });

      return new Promise<void>((done) => {
        testStream(testedStream, (result) => {
          expect(result).toEqual(expect.arrayContaining(streamData));
          expect(resultMapper).toHaveBeenCalledTimes(2);
          done();
        });
      });
    });

    it("should process the success stream with result stream operator", () => {
      const baseStream = of(...streamData);

      const result = map((successValue: string) => `processed-${successValue}`);

      const testedStream = operateOnDataProcessingStream(baseStream, {
        result,
      });

      testStream(testedStream, (results) => {
        expect(results).toEqual(
          expect.arrayContaining([
            {
              result: "processed-result",
              type: MessageTypes.RESULT,
            },
            {
              result: "processed-result2",
              type: MessageTypes.RESULT,
            },
            errorElement,
          ])
        );
      });
    });
    it("should process the success stream with error stream operator", () => {
      const baseStream = of(...streamData);

      const error = map(
        (errorValue: string) => `processed-${errorValue}`
      ) as OperatorFunction<unknown, unknown>;

      const testedStream = operateOnDataProcessingStream<string, string>(
        baseStream,
        {
          error,
          result: identity,
        }
      );

      testStream(testedStream, (results) => {
        expect(results).toEqual(
          expect.arrayContaining([
            resultElement,
            resultElement2,
            {
              error: "processed-error",
              type: MessageTypes.ERROR,
            },
          ])
        );
      });
    });
  });
});
