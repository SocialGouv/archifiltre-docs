import { Observable } from "rxjs";
import { takeWhile } from "rxjs/operators";

type IsResult<T> = (value: any) => value is T;

export const computeQueue = <Input, Result, Error = never>(computingFn: (param: Input) => Promise<Result | Error>, isResult: IsResult<Result>) => (input: Input[]) =>
    new Observable<{
        results: Result[];
        errors: Error[];
        remaining: Input[];
    }>(
        (observer) => {
            let results: Result[] = [];
            let errors: Error[] = [];
            let remaining: Input[] = input;

            const run = async () => {
                while (remaining.length > 0) {
                    const computed = remaining[0];
                    remaining = remaining.slice(1);
                    const value = await computingFn(computed);

                    if (isResult(value)) {
                        results = [...results, value];
                    } else {
                        errors = [...errors, value];
                    }

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