import { Observable } from "rxjs";
import translations from "translations/translations";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { TagMap } from "reducers/tags/tags-types";
import {
  backgroundWorkerProcess$,
  filterResults,
} from "util/batch-process/batch-process-util";
import ResipExportFork from "./resip-export.fork";
import { map } from "rxjs/operators";

interface ResipExportProgress {
  count: number;
  resipCsv: string[][];
}

interface GenerateResipExportOptions {
  aliases: AliasMap;
  comments: CommentsMap;
  elementsToDelete: string[];
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  tags: TagMap;
}

/**
 * Returns an observable that emits the final result and the progress state of the export
 * @param aliases
 * @param comments
 * @param filesAndFolders
 * @param filesAndFoldersMetadata
 * @param tags
 * @param elementsToDelete
 * @returns {Observable<ResipExportProgress>} An observable to follow the export progress
 */
export const generateResipExport$ = ({
  aliases,
  comments,
  elementsToDelete,
  filesAndFolders,
  filesAndFoldersMetadata,
  tags,
}: GenerateResipExportOptions): Observable<ResipExportProgress> => {
  const { language } = translations;

  return backgroundWorkerProcess$(
    {
      aliases,
      comments,
      elementsToDelete,
      filesAndFolders,
      filesAndFoldersMetadata,
      language,
      tags,
    },
    ResipExportFork
  )
    .pipe(filterResults())
    .pipe(map(({ result }) => result));
};
