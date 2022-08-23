import { arrayToCsv } from "@common/utils/csv";
import { flatten } from "lodash";
import { Observable } from "rxjs";
import { tap, toArray } from "rxjs/operators";

import type { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import type {
  ErrorMessage,
  ResultMessage,
} from "../../utils/batch-process/types";
import { MessageTypes } from "../../utils/batch-process/types";
import { computeTreeStructureArray } from "../../utils/tree-representation";

/**
 * Asynchronously generates a tree csv export
 * @returns an observable that emits each time a file is computed and emits the export string as the last value
 * @param filesAndFolders
 */
export const generateTreeCsvExport$ = (
  filesAndFolders: FilesAndFoldersMap
): Observable<ErrorMessage | ResultMessage> => {
  return new Observable<ResultMessage>((subscriber) => {
    const header = [""];
    void computeTreeStructureArray(filesAndFolders)
      .pipe(
        tap((lineComputed) => {
          subscriber.next({
            result: lineComputed.length,
            type: MessageTypes.RESULT,
          });
        }),
        toArray()
      )
      .toPromise()
      .then(flatten)
      .then((rows) => {
        subscriber.next({
          result: arrayToCsv([header, ...rows]),
          type: MessageTypes.RESULT,
        });

        subscriber.complete();
      });
  });
};
