import { identity, merge, Observable, OperatorFunction, partition } from "rxjs";
import { map, tap } from "rxjs/operators";

export enum DataProcessingStatus {
  ERROR = "error",
  RESULT = "result"
}

interface DataProcessingError {
  type: DataProcessingStatus;
  error: any;
}

interface DataProcessingResult {
  type: DataProcessingStatus;
  result: any;
}

type DataProcessingElement = DataProcessingError | DataProcessingResult;

type DataProcessingStream = Observable<DataProcessingElement>;

interface DataProcessingStreamOperators {
  error?: OperatorFunction<any, any>;
  result?: OperatorFunction<any, any>;
}

/**
 * Allows to operate on errors and results of a data processing stream
 * @param status$ - The data processing stream
 * @param errorOperator - The operator to apply to the error stream
 * @param resultOperator - The operator to apply to the result stream
 * @example
 * // I want to buffer results
 * operateOnDataProcessingStream(stream$, {
 *   result: compose(
 *       filter(buffer => buffer.length > 0),
 *       bufferTime(BUFFER_TIME)
 *   )
 * });
 */
export const operateOnDataProcessingStream = (
  status$: DataProcessingStream,
  {
    error: errorOperator = identity,
    result: resultOperator = identity
  }: DataProcessingStreamOperators
): DataProcessingStream => {
  const [results$, errors$] = partition(
    status$,
    ({ type }) => type === DataProcessingStatus.RESULT
  ) as [Observable<DataProcessingResult>, Observable<DataProcessingError>];

  const processedResults$ = results$.pipe(
    map(({ result }) => result),
    resultOperator,
    map(result => ({ type: DataProcessingStatus.RESULT, result }))
  );

  const processedErrors$ = errors$.pipe(
    map(({ error }) => error),
    errorOperator,
    map(error => ({ type: DataProcessingStatus.ERROR, error }))
  );

  return merge(processedResults$, processedErrors$);
};
