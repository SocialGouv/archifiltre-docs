import { createHash } from "crypto";
import md5File from "md5-file";
import { join } from "path";
import type { Observable } from "rxjs";
import { throttleTime } from "rxjs/operators";

import { isInCompressedFolder } from "../../../renderer/utils";
import { ipcRenderer } from "../../ipc";
import type { WorkerError } from "../../types";
import type { ArchifiltreDocsError } from "../error";
import { ArchifiltreDocsErrorType } from "../error";
import {
  ArchifiltreDocsFileSystemErrorCode,
  UnknownError,
} from "../error/error-codes";
import type { HashesMap } from "../hashes-types";
import type { Queue } from "../queue/queue";
import { computeQueue } from "../queue/queue";
import type { HashComputingError } from "./hash-errors";
import {
  ACCESS_DENIED,
  accessDenied,
  FILE_NOT_FOUND,
  fileNotFound,
  unhandledFileError,
} from "./hash-errors";

export interface HashComputingResult {
  hash: string;
  path: string;
  type: "result";
}

export const isResult = (
  values: HashComputingError | HashComputingResult
): values is HashComputingResult => values.type === "result";

export const hashResult = (
  path: string,
  hash: string
): HashComputingResult => ({
  hash,
  path,
  type: "result",
});

/**
 * Computes the MD5 hash of a file at the specified path.
 * @param filePath The path of the file to hash.
 * @returns A promise resolved with either a HashComputingResult or a HashComputingError.
 */
export const computeHash = async (
  filePath: string
): Promise<HashComputingError | HashComputingResult> => {
  if (isInCompressedFolder(filePath)) {
    return {
      hash: createHash("sha256").update(filePath).digest("hex"),
      path: filePath,
      type: "result",
    };
  }

  try {
    const hash = await md5File(filePath);
    return hashResult(filePath, hash);
  } catch (err: unknown) {
    const workerError = err as WorkerError;
    if (workerError.code === "ENOENT") {
      return fileNotFound(filePath);
    }
    if (workerError.code === "EACCES") {
      return accessDenied(filePath);
    }

    return unhandledFileError(filePath, workerError.message);
  }
};

export const computeHashes = (
  files: string[],
  basePath: string
): Observable<Queue<string, HashComputingResult, HashComputingError>> => {
  const computeFn = computeQueue<
    string,
    HashComputingResult,
    HashComputingError
  >(
    async (filePaths: string[]) =>
      ipcRenderer.invoke("hash.computeHash", filePaths),
    isResult
  );

  const paths = files.map((file) => join(basePath, file));

  return computeFn(paths).pipe(
    throttleTime(1000, void 0, {
      leading: true,
      trailing: true,
    })
  );
};

const hashErrorCodeToArchifiltreDocsErrorCode = (hashErrorCode: string) => {
  switch (hashErrorCode) {
    case FILE_NOT_FOUND:
      return ArchifiltreDocsFileSystemErrorCode.ENOENT;
    case ACCESS_DENIED:
      return ArchifiltreDocsFileSystemErrorCode.EACCES;
    default:
      return UnknownError.UNKNOWN;
  }
};

export const hashErrorToArchifiltreDocsError = (
  hashError: HashComputingError
): ArchifiltreDocsError => ({
  code: hashErrorCodeToArchifiltreDocsErrorCode(hashError.type),
  filePath: hashError.path,
  reason: hashError.type,
  type: ArchifiltreDocsErrorType.COMPUTING_HASHES,
});

export const hashResultsToMap = (results: HashComputingResult[]): HashesMap =>
  results.reduce<HashesMap>((acc, result) => {
    acc[result.path] = result.hash;
    return acc;
  }, {});
