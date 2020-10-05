export enum MessageTypes {
  COMPLETE = "complete",
  DATA = "data",
  ERROR = "error",
  WARNING = "warning",
  FATAL = "fatal",
  INITIALIZE = "initialize",
  LOG = "log",
  RESULT = "result",
}

export type ErrorMessage = {
  type: typeof MessageTypes.ERROR;
  error: object;
};

export type ResultMessage = {
  type: typeof MessageTypes.RESULT;
  result: any;
};

type InitializeMessage = {
  type: typeof MessageTypes.INITIALIZE;
  data: any;
};

type CompleteMessage = {
  type: typeof MessageTypes.COMPLETE;
  result?: any;
};

type WarningMessage = {
  type: typeof MessageTypes.WARNING;
  warning: any;
};

type FatalMessage = {
  type: typeof MessageTypes.FATAL;
  error: any;
};

type LogMessage = {
  type: typeof MessageTypes.LOG;
  data: any;
};

export type WorkerMessage =
  | ErrorMessage
  | ResultMessage
  | InitializeMessage
  | CompleteMessage
  | WarningMessage
  | FatalMessage
  | LogMessage;
