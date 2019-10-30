export enum MessageTypes {
  COMPLETE = "complete",
  DATA = "data",
  ERROR = "error",
  INITIALIZE = "initialize",
  LOG = "log",
  RESULT = "result"
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

export type WorkerMessage = Message | ErrorMessage | ResultMessage;
