/* eslint-disable @typescript-eslint/naming-convention */
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
/* eslint-enable @typescript-eslint/naming-convention */

export interface ReadyMessage {
  type: typeof MessageTypes.READY;
}

export interface ErrorMessage {
  type: typeof MessageTypes.ERROR;
  error: unknown;
}

export interface ResultMessage<T = unknown> {
  type: typeof MessageTypes.RESULT;
  result: T;
}

export interface StreamReadMessage {
  type: typeof MessageTypes.STREAM_READ;
}

export interface InitializeMessage<T = unknown> {
  type: typeof MessageTypes.INITIALIZE;
  data: T;
}

export interface DataMessage {
  type: typeof MessageTypes.DATA;
  data: unknown;
}

interface CompleteMessage {
  type: typeof MessageTypes.COMPLETE;
  result?: unknown;
}

interface WarningMessage {
  type: typeof MessageTypes.WARNING;
  warning: unknown;
}

interface FatalMessage {
  type: typeof MessageTypes.FATAL;
  error: unknown;
}

interface LogMessage {
  type: typeof MessageTypes.LOG;
  data: unknown;
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

export type WorkerMessageWithData = Extract<WorkerMessage, { data: unknown }>;
