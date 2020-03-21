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

interface Message {
  type: MessageTypes;
}

interface ErrorMessage extends Message {
  error: object;
}

interface ResultMessage extends Message {
  result: any;
}

interface InitializeMessage extends Message {
  data: any;
}

export type WorkerMessage =
  | Message
  | ErrorMessage
  | ResultMessage
  | InitializeMessage;
