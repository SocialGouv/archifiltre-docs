import { of } from "rxjs";
import { map, toArray } from "rxjs/operators";
import {
  DataProcessingStatus,
  operateOnDataProcessingStream
} from "./observable-util";

const resultElement = {
  result: "result",
  type: DataProcessingStatus.RESULT
};

const resultElement2 = {
  result: "result2",
  type: DataProcessingStatus.RESULT
};

const errorElement = {
  error: "error",
  type: DataProcessingStatus.ERROR
};

const streamData = [resultElement, errorElement, resultElement2];

const testStream = (stream, test) => {
  return stream.pipe(toArray()).subscribe(test);
};

describe("observable-utl", () => {
  describe("operateOnDataProcessingStream", () => {
    it("should return the same stream with no operators", done => {
      const baseStream = of(...streamData);

      const testedStream = operateOnDataProcessingStream(baseStream, {});

      testStream(testedStream, result => {
        expect(result).toEqual(expect.arrayContaining(streamData));
        done();
      });
    });

    it("should process the success stream with result stream operator", () => {
      const baseStream = of(...streamData);

      const result = map((successValue: string) => `processed-${successValue}`);

      const testedStream = operateOnDataProcessingStream(baseStream, {
        result
      });

      testStream(testedStream, results => {
        expect(results).toEqual(
          expect.arrayContaining([
            {
              result: "processed-result",
              type: DataProcessingStatus.RESULT
            },
            {
              result: "processed-result2",
              type: DataProcessingStatus.RESULT
            },
            errorElement
          ])
        );
      });
    });
    it("should process the success stream with error stream operator", () => {
      const baseStream = of(...streamData);

      const error = map((errorValue: string) => `processed-${errorValue}`);

      const testedStream = operateOnDataProcessingStream(baseStream, {
        error
      });

      testStream(testedStream, results => {
        expect(results).toEqual(
          expect.arrayContaining([
            resultElement,
            resultElement2,
            {
              error: "processed-error",
              type: DataProcessingStatus.ERROR
            }
          ])
        );
      });
    });
  });
});
