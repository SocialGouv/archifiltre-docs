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

interface ErrorMessage {
  type: typeof MessageTypes.ERROR;
  error: object;
}

interface ResultMessage {
  type: typeof MessageTypes.RESULT;
  result: any;
}

interface InitializeMessage {
  type: typeof MessageTypes.INITIALIZE;
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

export type WorkerMessage =
  | ErrorMessage
  | ResultMessage
  | InitializeMessage
  | CompleteMessage
  | WarningMessage
  | FatalMessage;
