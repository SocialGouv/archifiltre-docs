import md5File from "md5-file";
import path from "path";
import { throttleTime, throttleTime } from "rxjs/operators";

import { ipcRenderer } from "../../common/ipc";
import type { HashesMap, HashesMap } from "../../reducers/hashes/hashes-types";
import {
    ArchifiltreFileSystemErrorCode,
    ArchifiltreFileSystemErrorCode,
    UnknownError,
    UnknownError,
} from "../error/error-codes";
import type { ArchifiltreError, ArchifiltreError } from "../error/error-util";
import {
    ArchifiltreErrorType,
    ArchifiltreErrorType,
} from "../error/error-util";
import { computeQueue, computeQueue } from "../queue/queue";
import type { HashComputingError, HashComputingError } from "./hash-errors";
import {
    ACCESS_DENIED,
    accessDenied,
    FILE_NOT_FOUND,
    fileNotFound,
    unhandledFileError,
} from "./hash-errors";

export interface HashComputingResult {
    type: "result";
    path: string;
    hash: string;
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

export const computeHash = async (
    filePath: string
): Promise<HashComputingError | HashComputingResult> => {
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
    const computeFn = computeQueue(async (filePaths: string[]) => {
        return ipcRenderer.invoke("hash.computeHash", filePaths);
    }, isResult);

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
    code: hashErrorCodeToArchifiltreErrorCode(hashError.type),
    filePath: hashError.path,
    reason: hashError.type,
    type: ArchifiltreErrorType.COMPUTING_HASHES,
});

export const hashResultsToMap = (results: HashComputingResult[]): HashesMap =>
    results.reduce<HashesMap>((acc, result) => {
        acc[result.path] = result.hash;
        return acc;
    }, {});
