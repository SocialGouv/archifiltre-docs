import { chunk } from "lodash";
import { Observable } from "rxjs";
import { takeWhile } from "rxjs/operators";


const CHUNK_SIZE = 1500;

type IsResult<T> = (value: any) => value is T;

export const computeQueue = <Input, Result, Error = never>(computingFn: (param: Input[]) => Promise<(Result | Error)[]>, isResult: IsResult<Result>) => (input: Input[]) =>
    new Observable<{
        results: Result[];
        errors: Error[];
        remaining: Input[][];
    }>(
        (observer) => {
            let results: Result[] = [];
            let errors: Error[] = [];
            let remaining: Input[][] = chunk(input, CHUNK_SIZE);

            const run = async () => {
                while (remaining.length > 0) {
                    const computed = remaining[0];
                    remaining = remaining.slice(1);
                    const values = await computingFn(computed);
                    const newResults = values.filter((v): v is Result => isResult(v));
                    const newErrors = values.filter((v): v is Error => !isResult(v));

                    results = [...results, ...newResults];
                    errors = [...errors, ...newErrors];

                    observer.next({
                        results,
                        errors,
                        remaining
                    });
                }
            }

            run();
        }
    ).pipe(
        takeWhile(({ remaining }) => remaining.length > 0, true)
    );