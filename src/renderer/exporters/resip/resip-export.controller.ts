import { type Observable } from "rxjs";
import { map } from "rxjs/operators";

import {
  type AliasMap,
  type CommentsMap,
  type FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import { type FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { type ActiveSedaFields, type SedaMetadataMap } from "../../reducers/seda-configuration/seda-configuration-type";
import { type TagMap } from "../../reducers/tags/tags-types";
import { translations } from "../../translations/translations";
import { createAsyncWorkerForChildProcessControllerFactory } from "../../utils/async-worker/child-process";
import { backgroundWorkerProcess$, filterResults } from "../../utils/batch-process";

interface ResipExportProgress {
  count: number;
  resipCsv: string[][];
}

interface GenerateResipExportOptions {
  activeSedaFields: ActiveSedaFields;
  aliases: AliasMap;
  comments: CommentsMap;
  elementsToDelete: string[];
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  sedaMetadata: SedaMetadataMap;
  tags: TagMap;
}

/**
 * Returns an observable that emits the final result and the progress state of the export
 * @returns {Observable<ResipExportProgress>} An observable to follow the export progress
 * @param options
 */
export const generateResipExport$ = (options: GenerateResipExportOptions): Observable<ResipExportProgress> => {
  const { language } = translations;

  return backgroundWorkerProcess$(
    {
      language,
      ...options,
    },
    createAsyncWorkerForChildProcessControllerFactory("exporters/resip/resip-export.fork.ts"),
  )
    .pipe(filterResults<ResipExportProgress>())
    .pipe(map(({ result }) => result));
};
