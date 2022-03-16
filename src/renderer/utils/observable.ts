import type { Observable, OperatorFunction } from "rxjs";
import { identity, merge, partition } from "rxjs";
import { map } from "rxjs/operators";

import type { ErrorMessage, ResultMessage } from "./batch-process/types";
import { MessageTypes } from "./batch-process/types";

interface DataProcessingError {
  type: MessageTypes;
  error: unknown;
}

export interface DataProcessingResult<T> {
  type: MessageTypes;
  result: T;
}

export type DataProcessingElement<T> = ErrorMessage | ResultMessage<T>;

export type DataProcessingStream<T> = Observable<DataProcessingElement<T>>;

interface DataProcessingStreamOperators<TInput, TOutput> {
  error?: OperatorFunction<unknown, unknown>;
  result: OperatorFunction<TInput, TOutput>;
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
export const operateOnDataProcessingStream = <TInput, TOutput>(
  status$: DataProcessingStream<TInput>,
  {
    error: errorOperator = identity,
    result: resultOperator,
  }: DataProcessingStreamOperators<TInput, TOutput>
): DataProcessingStream<TOutput> => {
  const [results$, errors$] = partition(
    status$,
    (message): message is ResultMessage<TInput> =>
      message.type === MessageTypes.RESULT
  ) as [
    Observable<DataProcessingResult<TInput>>,
    Observable<DataProcessingError>
  ];

  const processedResults$ = results$.pipe(
    map(({ result }) => result),
    resultOperator,
    map((result) => ({ result, type: MessageTypes.RESULT as const }))
  );

  const processedErrors$ = errors$.pipe(
    map(({ error }) => error),
    errorOperator,
    map((error) => ({ error, type: MessageTypes.ERROR as const }))
  );

  return merge(processedResults$, processedErrors$);
};
