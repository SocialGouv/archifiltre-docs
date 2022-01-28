import { chunk } from "lodash";
import { Observable } from "rxjs";
import { takeWhile } from "rxjs/operators";

const CHUNK_SIZE = 1500;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Guard
type IsResult<T> = (value: any) => value is T;

export interface Queue<TInput, TResult, TError = never> {
  results: TResult[];
  errors: TError[];
  remaining: TInput[][];
}

export const computeQueue =
  <TInput, TResult, TError = never>(
    computingFn: (param: TInput[]) => Promise<(TError | TResult)[]>,
    isResult: IsResult<TResult>
  ) =>
  (input: TInput[]): Observable<Queue<TInput, TResult, TError>> =>
    new Observable<Queue<TInput, TResult, TError>>((observer) => {
      let results: TResult[] = [];
      let errors: TError[] = [];
      let remaining: TInput[][] = chunk(input, CHUNK_SIZE);

      const run = async () => {
        while (remaining.length > 0) {
          const computed = remaining[0];
          remaining = remaining.slice(1);
          const values = await computingFn(computed);
          const newResults = values.filter((value): value is TResult =>
            isResult(value)
          );
          const newErrors = values.filter(
            (value): value is TError => !isResult(value)
          );

          results = [...results, ...newResults];
          errors = [...errors, ...newErrors];

          observer.next({
            errors,
            remaining,
            results,
          });
        }
      };

      void run();
    }).pipe(takeWhile(({ remaining }) => remaining.length > 0, true));
