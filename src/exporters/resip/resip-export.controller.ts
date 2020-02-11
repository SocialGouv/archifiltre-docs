import { Observable } from "rxjs";
import { getLanguage } from "../../languages";
import { addTracker } from "../../logging/tracker";
import { ActionTitle, ActionType } from "../../logging/tracker-types";
import {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap
} from "../../reducers/files-and-folders/files-and-folders-types";
import { TagMap } from "../../reducers/tags/tags-types";
import { createAsyncWorkerControllerClass } from "../../util/async-worker-util";
import { backgroundWorkerProcess$ } from "../../util/batch-process/batch-process-util";
import ResipExportFork from "./resip-export.fork";

interface ResipExportProgress {
  count: number;
  resipCsv: string[][];
}

interface GenerateResipExportOptions {
  aliases: AliasMap;
  comments: CommentsMap;
  elementsToDelete: string[];
  filesAndFolders: FilesAndFoldersMap;
  tags: TagMap;
}

/**
 * Returns an observable that emits the final result and the progress state of the export
 * @param aliases
 * @param comments
 * @param filesAndFolders
 * @param tags
 * @param elementsToDelete
 * @returns {Observable<ResipExportProgress>} An observable to follow the export progress
 */
export const generateResipExport$ = ({
  aliases,
  comments,
  elementsToDelete,
  filesAndFolders,
  tags
}: GenerateResipExportOptions): Observable<ResipExportProgress> => {
  addTracker({
    title: ActionTitle.RESIP_EXPORT,
    type: ActionType.TRACK_EVENT
  });
  const ResipExportAsyncWorker = createAsyncWorkerControllerClass(
    ResipExportFork
  );

  return backgroundWorkerProcess$(
    {
      aliases,
      comments,
      elementsToDelete,
      filesAndFolders,
      language: getLanguage()[0],
      tags
    },
    ResipExportAsyncWorker
  );
};
