import type { Observable } from "rxjs";

import type { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { translations } from "../../translations/translations";
import { createAsyncWorkerForChildProcessControllerFactory } from "../../utils/async-worker/child-process";
import { backgroundWorkerProcess$ } from "../../utils/batch-process";
import type {
  ErrorMessage,
  ResultMessage,
} from "../../utils/batch-process/types";

/**
 * Asynchronously generates a tree csv export
 * @returns an observable that emits each time a file is computed and emits the export string as the last value
 * @param filesAndFolders
 */
export const generateTreeCsvExport$ = (
  filesAndFolders: FilesAndFoldersMap
): Observable<ErrorMessage | ResultMessage> => {
  const { language } = translations;
  return backgroundWorkerProcess$(
    { filesAndFolders, language },
    createAsyncWorkerForChildProcessControllerFactory(
      "exporters/csv/tree-csv-exporter.fork.ts"
    )
  );
};
