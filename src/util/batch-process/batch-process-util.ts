import { cpus } from "os";
import type { Observable, OperatorFunction } from "rxjs";
import { fromEvent, merge, Subject } from "rxjs";
import { filter, map, take, takeWhile, tap } from "rxjs/operators";

import { reportError } from "../../logging/reporter";
import { createArchifiltreError } from "../../reducers/loading-info/loading-info-selectors";
import type { ProcessControllerAsyncWorker } from "../async-worker/async-worker-util";
import { WorkerEventType } from "../async-worker/async-worker-util";
import { ArchifiltreErrorType } from "../error/error-util";
import type { ProcessControllerAsyncWorkerFactory } from "../worker-manager/worker-manager";
import { workerManager } from "../worker-manager/worker-manager";
import type {
    ErrorMessage,
    ReadyMessage,
    ResultMessage,
    WorkerMessage,
} from "./batch-process-util-types";
import { MessageTypes } from "./batch-process-util-types";

// We create NB_CPUS - 1 processes to optimize computation
const NB_CPUS = cpus().length - 1 > 0 ? cpus().length - 1 : 1;

interface InitWorkersData {
    onMessage?: (worker: unknown, data: unknown) => void;
    initialValues?: unknown;
    workerCount?: number;
}

interface MessageAndWorker<TMessageType = WorkerMessage> {
    message: TMessageType;
    worker: ProcessControllerAsyncWorker;
}

interface InitWorkersResult {
    result$: Observable<MessageAndWorker>;
    terminate: () => void;
}

const spawnWorkers = (
    asyncWorkerFactory: ProcessControllerAsyncWorkerFactory,
    count = NB_CPUS
) =>
    new Array(count)
        .fill(null)
        .map(() => workerManager.spawn(asyncWorkerFactory));

interface SetupedWorker {
    result$: Observable<MessageAndWorker>;
    terminate: () => void;
}
export const setupWorkers$ = (
    workers: ProcessControllerAsyncWorker[],
    initialValues: unknown
): SetupedWorker => {
    const result$ = merge(
        ...workers
            .map((worker) => {
                worker.addEventListener(WorkerEventType.ERROR, (error) => {
                    reportError({ error, type: "WorkerError" });
                });
                worker.postMessage({
                    data: initialValues,
                    type: MessageTypes.INITIALIZE,
                });
                return worker;
            })
            .map(
                (worker): Observable<MessageAndWorker> =>
                    fromEvent(worker, WorkerEventType.MESSAGE).pipe(
                        tap(({ type }) => {
                            if (type === MessageTypes.COMPLETE) {
                                worker.terminate();
                            }
                        }),
                        tap((message) => {
                            if (message.type === MessageTypes.FATAL) {
                                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                                throw createArchifiltreError({
                                    reason: message.error as string,
                                    type: ArchifiltreErrorType.BATCH_PROCESS_ERROR,
                                });
                            }
                        }),
                        takeWhile(({ type }) => type !== MessageTypes.COMPLETE),
                        map((message: WorkerMessage) => ({
                            message,
                            worker,
                        }))
                    )
            )
    );
    const terminate = () => {
        workers.forEach((worker) => {
            worker.terminate();
        });
    };
    return { result$, terminate };
};

export const initWorkers$ = (
    asyncWorkerFactory: ProcessControllerAsyncWorkerFactory,
    { initialValues, workerCount = NB_CPUS }: InitWorkersData
): InitWorkersResult => {
    const workers = spawnWorkers(asyncWorkerFactory, workerCount);

    return setupWorkers$(workers, initialValues);
};

const filterResultsErrorsAndReady = (
    param: MessageAndWorker
): param is MessageAndWorker<ErrorMessage | ReadyMessage | ResultMessage> =>
    [MessageTypes.READY, MessageTypes.RESULT, MessageTypes.ERROR].includes(
        param.message.type
    );

const filterResultsAndErrors = (
    message: WorkerMessage
): message is ErrorMessage | ResultMessage =>
    message.type === MessageTypes.RESULT || message.type === MessageTypes.ERROR;

export const processQueueWithWorkers = (
    results$: Observable<MessageAndWorker>,
    data: unknown[],
    batchSize: number
): Observable<unknown> => {
    let index = 0;
    const subject = new Subject<MessageAndWorker>();
    const messageCount = Math.ceil(data.length / batchSize);

    results$
        .pipe(
            filter(filterResultsErrorsAndReady),
            tap(({ worker }) => {
                if (index < data.length) {
                    worker.postMessage({
                        data: data.slice(index, index + batchSize),
                        type: MessageTypes.DATA,
                    });
                    index += batchSize;
                }
            })
        )
        .subscribe((dataSubscribed) => {
            subject.next(dataSubscribed);
        });

    return subject.pipe(
        map(({ message }) => message),
        filter(filterResultsAndErrors),
        take(messageCount)
    );
};

export const computeBatch$ = (
    data: unknown[],
    asyncWorkerFactory: ProcessControllerAsyncWorkerFactory,
    { batchSize, initialValues }: { batchSize: number; initialValues: unknown }
): Observable<unknown> => {
    const { result$ } = initWorkers$(asyncWorkerFactory, { initialValues });

    return processQueueWithWorkers(result$, data, batchSize);
};

// eslint-disable-next-line @typescript-eslint/naming-convention
type LookUp<U, T> = U extends { type: T } ? U : never;

const onMessageType = <T extends MessageTypes>(
    type: T,
    effect: (message: LookUp<WorkerMessage, T>) => void
) =>
    tap((message: WorkerMessage) => {
        if (message.type === type) {
            effect(message as LookUp<WorkerMessage, T>);
        }
    });

/**
 * Delegates work to a single worker. Progress will be piped in the returned Observable
 * @param processedData - The data processed. It will be sent to the worker in an "initialize" message.
 * @param asyncWorkerFactory
 * @returns {Observable} - A rxjs observable piping progress.
 */
export const backgroundWorkerProcess$ = (
    processedData: unknown,
    asyncWorkerFactory: ProcessControllerAsyncWorkerFactory
): Observable<ErrorMessage | ResultMessage> =>
    cancelableBackgroundWorkerProcess$(processedData, asyncWorkerFactory)
        .result$;

interface CancelableBackgroundWorkerProcessResult<T = unknown> {
    result$: Observable<ErrorMessage | ResultMessage<T>>;
    terminate: () => void;
}

export const cancelableBackgroundWorkerProcess$ = <T = unknown>(
    processedData: unknown,
    asyncWorkerFactory: ProcessControllerAsyncWorkerFactory
): CancelableBackgroundWorkerProcessResult<T> => {
    const { result$, terminate } = initWorkers$(asyncWorkerFactory, {
        initialValues: processedData,
        workerCount: 1,
    });
    const processedResult$ = result$.pipe(
        map(({ message }): WorkerMessage => message),
        onMessageType(MessageTypes.ERROR, (message) => {
            reportError(message.error);
        }),
        onMessageType(MessageTypes.LOG, (message) => {
            console.log("Logging :", message.data);
        }),
        filter<WorkerMessage, ErrorMessage | ResultMessage>(
            (message: WorkerMessage): message is ErrorMessage | ResultMessage =>
                message.type === MessageTypes.RESULT ||
                message.type === MessageTypes.ERROR
        )
    ) as Observable<ErrorMessage | ResultMessage<T>>;
    return { result$: processedResult$, terminate };
};

export interface BatchProcessResult<T> {
    param: string;
    result: T;
}

export interface BatchProcessError {
    param: string;
    error: unknown;
}

type AggregatedResult<T> = Record<string, T>;

export const aggregateResultsToMap = <T>(
    results: BatchProcessResult<T>[]
): AggregatedResult<T> => {
    const valuesMap: AggregatedResult<T> = {};

    return results
        .map((result: BatchProcessResult<T>) => ({
            [result.param]: result.result,
        }))
        .reduce(
            (
                aggregatedResult: AggregatedResult<T>,
                result: AggregatedResult<T>
            ) => Object.assign(aggregatedResult, result),
            valuesMap
        );
};

export const aggregateErrorsToMap = (
    errors: BatchProcessError[]
): AggregatedResult<unknown> => {
    const valuesMap: AggregatedResult<unknown> = {};

    return errors
        .map((result: BatchProcessError) => ({ [result.param]: result.error }))
        .reduce(
            (
                aggregatedResult: AggregatedResult<unknown>,
                result: AggregatedResult<unknown>
            ) => Object.assign(aggregatedResult, result),
            valuesMap
        );
};

export const filterResults = <TResultType>(): OperatorFunction<
    WorkerMessage,
    ResultMessage<TResultType>
> =>
    filter(
        (message: WorkerMessage): message is ResultMessage<TResultType> =>
            message.type === MessageTypes.RESULT
    );
