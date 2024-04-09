import { type ArchifiltreDocsErrorCode } from "./utils/error/error-codes";

export interface WorkerError {
  code: ArchifiltreDocsErrorCode;
  message: string;
  path: string;
}
