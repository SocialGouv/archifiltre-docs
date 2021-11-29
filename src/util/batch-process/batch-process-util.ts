import { reportError } from "logging/reporter";
import { cpus } from "os";
import { createArchifiltreError } from "reducers/loading-info/loading-info-selectors";
import type { Observable } from "rxjs";
import { fromEvent, merge, Subject } from "rxjs";
import { filter, map, take, takeWhile, tap } from "rxjs/operators";
import { makeEmptyArray } from "util/array/array-util";
import type { ProcessControllerAsyncWorker } from "util/async-worker/async-worker-util";
import { WorkerEventType } from "util/async-worker/async-worker-util";
import type {
    ErrorMessage,
    ReadyMessage,
    ResultMessage,
    WorkerMessage,
} from "util/batch-process/batch-process-util-types";
import { MessageTypes } from "util/batch-process/batch-process-util-types";
import { ArchifiltreErrorType } from "util/error/error-util";
import type { ProcessControllerAsyncWorkerFactory } from "util/worker-manager/worker-manager";
import workerManager from "util/worker-manager/worker-manager";

// We create NB_CPUS - 1 processes to optimize computation
const NB_CPUS = cpus().length - 1 > 0 ? cpus().length - 1 : 1;

interface InitWorkersData {
    onMessage?: (worker: any, data: any) => void;
    initialValues?: any;
    workerCount?: number;
}

interface MessageAndWorker<MessageType = WorkerMessage> {
    message: MessageType;
    worker: ProcessControllerAsyncWorker;
}

interface InitWorkersResult {
    result$: Observable<MessageAndWorker>;
    terminate: () => void;
}

const spawnWorkers = (
    asyncWorkerFactory: ProcessControllerAsyncWorkerFactory,
    count = NB_CPUS
): ProcessControllerAsyncWorker[] =>
    makeEmptyArray(count, null).map(() =>
        workerManager.spawn(asyncWorkerFactory)
    );

export const setupWorkers$ = (
    workers: ProcessControllerAsyncWorker[],
    initialValues: any
) => {
    const result$ = merge(
        ...workers
            .map((worker) => {
                worker.addEventListener(WorkerEventType.ERROR, (error) =>
                    reportError({ error, type: "WorkerError" })
                );
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
                                throw createArchifiltreError({
                                    reason: message.error,
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
        workers.forEach((worker) => worker.terminate());
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
    data: any[],
    batchSize: number
) => {
    let index = 0;
    const subject = new Subject();
    const messageCount = Math.ceil(data.length / batchSize);

    results$
        .pipe(
            filter(filterResultsErrorsAndReady),
            tap(({ worker, message }) => {
                if (index < data.length) {
                    worker.postMessage({
                        data: data.slice(index, index + batchSize),
                        type: MessageTypes.DATA,
                    });
                    index += batchSize;
                }
            })
        )
        .subscribe((data) => {
            subject.next(data);
        });

    return subject.pipe(
        map(({ message }) => message),
        filter(filterResultsAndErrors),
        take(messageCount)
    );
};

export const computeBatch$ = (
    data: any,
    asyncWorkerFactory: ProcessControllerAsyncWorkerFactory,
    { batchSize, initialValues }: { batchSize: number; initialValues: any }
): Observable<any> => {
    const { result$ } = initWorkers$(asyncWorkerFactory, { initialValues });

    return processQueueWithWorkers(result$, data, batchSize);
};

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
    processedData: any,
    asyncWorkerFactory: ProcessControllerAsyncWorkerFactory
): Observable<ErrorMessage | ResultMessage> =>
    cancelableBackgroundWorkerProcess$(processedData, asyncWorkerFactory)
        .result$;

interface CancelableBackgroundWorkerProcessResult {
    result$: Observable<ErrorMessage | ResultMessage>;
    terminate: () => void;
}

export const cancelableBackgroundWorkerProcess$ = (
    processedData: any,
    asyncWorkerFactory: ProcessControllerAsyncWorkerFactory
): CancelableBackgroundWorkerProcessResult => {
    const { result$, terminate } = initWorkers$(asyncWorkerFactory, {
        initialValues: processedData,
        workerCount: 1,
    });
    const processedResult$ = result$.pipe(
        map(({ message }) => message),
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
    );
    return { result$: processedResult$, terminate };
};

export interface BatchProcessResult<T> {
    param: string;
    result: T;
}

export interface BatchProcessError {
    param: string;
    error: any;
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
): AggregatedResult<any> => {
    const valuesMap: AggregatedResult<any> = {};

    return errors
        .map((result: BatchProcessError) => ({ [result.param]: result.error }))
        .reduce(
            (
                aggregatedResult: AggregatedResult<any>,
                result: AggregatedResult<any>
            ) => Object.assign(aggregatedResult, result),
            valuesMap
        );
};

export const filterResults = () =>
    filter(
        (message: WorkerMessage): message is ResultMessage =>
            message.type === MessageTypes.RESULT
    );
