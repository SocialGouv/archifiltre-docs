import { identity, Observable, OperatorFunction, partition, merge } from "rxjs";
import { map } from "rxjs/operators";
import {
  ErrorMessage,
  MessageTypes,
  ResultMessage,
} from "util/batch-process/batch-process-util-types";

type DataProcessingError = {
  type: MessageTypes;
  error: any;
};

export type DataProcessingResult<T> = {
  type: MessageTypes;
  result: T;
};

export type DataProcessingElement<T> = ErrorMessage | ResultMessage<T>;

export type DataProcessingStream<T> = Observable<DataProcessingElement<T>>;

type DataProcessingStreamOperators<Input, Output> = {
  error?: OperatorFunction<any, any>;
  result: OperatorFunction<Input, Output>;
};

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
    (message): message is ResultMessage<Input> =>
      message.type === MessageTypes.RESULT
  ) as [
    Observable<DataProcessingResult<Input>>,
    Observable<DataProcessingError>
  ];

  const processedResults$ = results$.pipe(
    map(({ result }) => result),
    resultOperator,
    map((result) => ({ type: MessageTypes.RESULT as const, result }))
  );

  const processedErrors$ = errors$.pipe(
    map(({ error }) => error),
    errorOperator,
    map((error) => ({ type: MessageTypes.ERROR as const, error }))
  );

  return merge(processedResults$, processedErrors$);
};
