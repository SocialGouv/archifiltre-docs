import { chunk } from "lodash";
import { Observable } from "rxjs";
import { takeWhile } from "rxjs/operators";

const CHUNK_SIZE = 1500;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Guard
type IsResult<T> = (value: any) => value is T;

export interface Queue<TInput, TResult, TError = never> {
  errors: TError[];
  remaining: TInput[][];
  results: TResult[];
}

export const computeQueue =
  <TInput, TResult, TError = never>(
    computingFn: (param: TInput[]) => Promise<(TError | TResult)[]>,
    _isResult: IsResult<TResult>
  ) =>
  (input: TInput[]): Observable<Queue<TInput, TResult, TError>> =>
    new Observable<Queue<TInput, TResult, TError>>((observer) => {
      const results: TResult[] = [];
      const errors: TError[] = [];
      let remaining: TInput[][] = chunk(input, CHUNK_SIZE);

      const run = async () => {
        console.log(`Starting to process ${remaining.length} chunks.`);

        while (remaining.length > 0) {
          const computed = remaining[0];
          remaining = remaining.slice(1);
          const values = await computingFn(computed);

          const newResults = values.filter((value): value is TResult =>
            _isResult(value)
          );
          const newErrors = values.filter(
            (value): value is TError => !_isResult(value)
          );

          results.push(...newResults);
          errors.push(...newErrors);

          console.log(
            `Processed chunk: results=${results.length}, errors=${errors.length}, remaining=${remaining.length}`
          );

          observer.next({
            errors,
            remaining,
            results,
          });
        }

        // Emit final update to ensure completion
        console.log("Emitting final update.");
        observer.next({
          errors,
          remaining: [],
          results,
        });

        // Complete the observable to signal the end
        console.log("Completing observable.");
        observer.complete();
      };

      void run();
    }).pipe(takeWhile(({ remaining }) => remaining.length > 0, true));
