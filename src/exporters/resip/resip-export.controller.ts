import { Observable } from "rxjs";
import { getLanguage } from "../../languages";
import { addTracker } from "../../logging/tracker";
import { ActionTitle, ActionType } from "../../logging/tracker-types";
import { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { TagMap } from "../../reducers/tags/tags-types";
import { createAsyncWorkerControllerClass } from "../../util/async-worker-util";
import { backgroundWorkerProcess$ } from "../../util/batch-process/batch-process-util";
import ResipExportFork from "./resip-export.fork";

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
  addTracker({
    title: ActionTitle.RESIP_EXPORT,
    type: ActionType.TRACK_EVENT
  });
  const ResipExportAsyncWorker = createAsyncWorkerControllerClass(
    ResipExportFork
  );

  return backgroundWorkerProcess$(
    { filesAndFolders, tags, language: getLanguage()[0] },
    ResipExportAsyncWorker
  );
};
