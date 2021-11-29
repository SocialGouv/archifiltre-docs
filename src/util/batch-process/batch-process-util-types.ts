export enum MessageTypes {
    READY = "ready",
    COMPLETE = "complete",
    DATA = "data",
    ERROR = "error",
    WARNING = "warning",
    FATAL = "fatal",
    INITIALIZE = "initialize",
    LOG = "log",
    RESULT = "result",
    STREAM_READ = "streamRead",
}

export interface ReadyMessage {
    type: typeof MessageTypes.READY;
}

export interface ErrorMessage {
    type: typeof MessageTypes.ERROR;
    error: any;
}

export interface ResultMessage<T = any> {
    type: typeof MessageTypes.RESULT;
    result: T;
}

export interface StreamReadMessage {
    type: typeof MessageTypes.STREAM_READ;
}

export interface InitializeMessage {
    type: typeof MessageTypes.INITIALIZE;
    data: any;
}

interface DataMessage {
    type: typeof MessageTypes.DATA;
    data: any;
}

interface CompleteMessage {
    type: typeof MessageTypes.COMPLETE;
    result?: any;
}

interface WarningMessage {
    type: typeof MessageTypes.WARNING;
    warning: any;
}

interface FatalMessage {
    type: typeof MessageTypes.FATAL;
    error: any;
}

interface LogMessage {
    type: typeof MessageTypes.LOG;
    data: any;
}

export type WorkerMessage =
    | CompleteMessage
    | DataMessage
    | ErrorMessage
    | FatalMessage
    | InitializeMessage
    | LogMessage
    | ReadyMessage
    | ResultMessage
    | StreamReadMessage
    | WarningMessage;
