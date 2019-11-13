import { Observable } from "rxjs";
import { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { TagMap } from "../../reducers/tags/tags-types";
import { createAsyncWorkerControllerClass } from "../../util/async-worker-util";
import { backgroundWorkerProcess$ } from "../../util/batch-process/batch-process-util";
import ResipExportFork from "./resipExport.fork";

interface ResipExportProgress {
  count: number;
  resipCsv: string[][];
}

/**
 * Returns an observable that emits the final result and the progress state of the export
 * @param filesAndFolders
 * @param tags
 * @returns {Observable<ResipExportProgress>} An observable to follow the export progress
 */
export const generateResipExport$ = (
  filesAndFolders: FilesAndFoldersMap,
  tags: TagMap
): Observable<ResipExportProgress> => {
  const ResipExportAsyncWorker = createAsyncWorkerControllerClass(
    ResipExportFork
  );

  return backgroundWorkerProcess$(
    { filesAndFolders, tags },
    ResipExportAsyncWorker
  );
};
