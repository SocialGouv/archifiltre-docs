import { identity, merge, Observable, OperatorFunction, partition } from "rxjs";
import { map } from "rxjs/operators";

export enum DataProcessingStatus {
  ERROR = "error",
  RESULT = "result",
}

interface DataProcessingError {
  type: DataProcessingStatus;
  error: any;
}

type DataProcessingResult<T> = {
  type: DataProcessingStatus;
  result: T;
};

type DataProcessingElement<T> = DataProcessingError | DataProcessingResult<T>;

export type DataProcessingStream<T> = Observable<DataProcessingElement<T>>;

interface DataProcessingStreamOperators<Input, Output> {
  error?: OperatorFunction<any, any>;
  result: OperatorFunction<Input, Output>;
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
export const operateOnDataProcessingStream = <Input, Output>(
  status$: DataProcessingStream<Input>,
  {
    error: errorOperator = identity,
    result: resultOperator,
  }: DataProcessingStreamOperators<Input, Output>
): DataProcessingStream<Output> => {
  const [results$, errors$] = partition(
    status$,
    ({ type }) => type === DataProcessingStatus.RESULT
  ) as [
    Observable<DataProcessingResult<Input>>,
    Observable<DataProcessingError>
  ];

  const processedResults$ = results$.pipe(
    map(({ result }) => result),
    resultOperator,
    map((result) => ({ type: DataProcessingStatus.RESULT, result }))
  );

  const processedErrors$ = errors$.pipe(
    map(({ error }) => error),
    errorOperator,
    map((error) => ({ type: DataProcessingStatus.ERROR, error }))
  );

  return merge(processedResults$, processedErrors$);
};
