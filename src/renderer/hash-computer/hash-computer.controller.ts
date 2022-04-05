import type { HashesMap } from "@common/utils/hashes-types";
import { Observable } from "rxjs";
import { bufferCount, map } from "rxjs/operators";

import type { FilesAndFoldersMap } from "../reducers/files-and-folders/files-and-folders-types";
import { computeFolderHashes } from "../utils/file-and-folders";

interface ComputeFolderHashesOptions {
  filesAndFolders: FilesAndFoldersMap;
  hashes: HashesMap;
}

/**
 * Returns an observable that will dispatch computed hashes every second
 * @param filesAndFolders - The filesAndFolders
 * @param hashes - The precomputed folder hashes
 * @returns {Observable<{}>}
 */
export const computeFolderHashes$ = ({
  filesAndFolders,
  hashes,
}: ComputeFolderHashesOptions): Observable<HashesMap> => {
  return new Observable<HashesMap>((subscriber) => {
    void computeFolderHashes(filesAndFolders, hashes, (hashesMap) => {
      subscriber.next(hashesMap);
    }).then(() => {
      subscriber.complete();
    });
  }).pipe(
    bufferCount(2000),
    map((values) => Object.assign({}, ...values) as HashesMap)
  );
};
