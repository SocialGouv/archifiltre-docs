import type { Observable, OperatorFunction } from "rxjs";
import { identity, merge, partition } from "rxjs";
import { map } from "rxjs/operators";
import type {
    ErrorMessage,
    ResultMessage,
} from "util/batch-process/batch-process-util-types";
import { MessageTypes } from "util/batch-process/batch-process-util-types";

interface DataProcessingError {
    type: MessageTypes;
    error: any;
}

export interface DataProcessingResult<T> {
    type: MessageTypes;
    result: T;
}

export type DataProcessingElement<T> = ErrorMessage | ResultMessage<T>;

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
        (message): message is ResultMessage<Input> =>
            message.type === MessageTypes.RESULT
    ) as [
        Observable<DataProcessingResult<Input>>,
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
