import { ipcRenderer } from "electron";
import md5File from "md5-file";
import {
  ACCESS_DENIED,
  accessDenied,
  FILE_NOT_FOUND,
  fileNotFound,
  HashComputingError,
  unhandledFileError,
} from "./hash-errors";
import path from "path";
import { computeQueue } from "../queue/queue";
import { throttleTime } from "rxjs/operators";
import { HashesMap } from "../../reducers/hashes/hashes-types";
import { ArchifiltreError, ArchifiltreErrorType } from "../error/error-util";
import {
  ArchifiltreFileSystemErrorCode,
  UnknownError,
} from "../error/error-codes";

export type HashComputingResult = {
  type: "result";
  path: string;
  hash: string;
};

export const isResult = (
  value: HashComputingResult | HashComputingError
): value is HashComputingResult => value.type === "result";

export const hashResult = (
  path: string,
  hash: string
): HashComputingResult => ({
  type: "result",
  path,
  hash,
});

export const computeHash = async (
  filePath: string
): Promise<HashComputingResult | HashComputingError> => {
  try {
    const hash = await md5File(filePath);
    return hashResult(filePath, hash);
  } catch (err) {
    if (err.code === "ENOENT") {
      return fileNotFound(filePath);
    }
    if (err.code === "EACCES") {
      return accessDenied(filePath);
    }

    return unhandledFileError(filePath, err.message);
  }
};

export const computeHashes = (files: string[], basePath: string) => {
  const computeFn = computeQueue(
    (filePath: string) => ipcRenderer.invoke("computeHash", filePath),
    isResult
  );

  const paths = files.map((file) => path.join(basePath, file));

  return computeFn(paths).pipe(
    throttleTime(1000, undefined, { leading: true, trailing: true })
  );
};

const hashErrorCodeToArchifiltreErrorCode = (hashErrorCode: string) => {
  switch (hashErrorCode) {
    case FILE_NOT_FOUND:
      return ArchifiltreFileSystemErrorCode.ENOENT;
    case ACCESS_DENIED:
      return ArchifiltreFileSystemErrorCode.EACCES;
    default:
      return UnknownError.UNKNOWN;
  }
};

export const hashErrorToArchifiltreError = (
  hashError: HashComputingError
): ArchifiltreError => ({
  type: ArchifiltreErrorType.COMPUTING_HASHES,
  filePath: hashError.path,
  code: hashErrorCodeToArchifiltreErrorCode(hashError.type),
  reason: hashError.type,
});

export const hashResultsToMap = (results: HashComputingResult[]): HashesMap =>
  results.reduce((acc, result) => {
    acc[result.path] = result.hash;
    return acc;
  }, {} as HashesMap);
