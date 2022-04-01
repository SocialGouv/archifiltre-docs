/* eslint-disable @typescript-eslint/naming-convention */
export enum MessageTypes {
  COMPLETE = "complete",
  DATA = "data",
  ERROR = "error",
  FATAL = "fatal",
  INITIALIZE = "initialize",
  LOG = "log",
  READY = "ready",
  RESULT = "result",
  STREAM_READ = "streamRead",
  WARNING = "warning",
}
/* eslint-enable @typescript-eslint/naming-convention */

export interface ReadyMessage {
  type: typeof MessageTypes.READY;
}

export interface ErrorMessage {
  error: unknown;
  type: typeof MessageTypes.ERROR;
}

export interface ResultMessage<T = unknown> {
  result: T;
  type: typeof MessageTypes.RESULT;
}

export interface StreamReadMessage {
  type: typeof MessageTypes.STREAM_READ;
}

export interface InitializeMessage<T = unknown> {
  data: T;
  type: typeof MessageTypes.INITIALIZE;
}

export interface DataMessage {
  data: unknown;
  type: typeof MessageTypes.DATA;
}

interface CompleteMessage {
  result?: unknown;
  type: typeof MessageTypes.COMPLETE;
}

interface WarningMessage {
  type: typeof MessageTypes.WARNING;
  warning: unknown;
}

interface FatalMessage {
  error: unknown;
  type: typeof MessageTypes.FATAL;
}

interface LogMessage {
  data: unknown;
  type: typeof MessageTypes.LOG;
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
