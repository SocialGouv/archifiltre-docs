import { Observable } from "rxjs";
import ResipExportWorker from "worker-loader!./resipExport.worker";
import { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { TagMap } from "../../reducers/tags/tags-types";
import { backgroundWorkerProcess$ } from "../../util/batch-process/batch-process-util";

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
): Observable<ResipExportProgress> =>
  backgroundWorkerProcess$({ filesAndFolders, tags }, ResipExportWorker);
