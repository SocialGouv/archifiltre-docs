import type { HashesMap } from "@common/utils/hashes-types";
import type { Observable } from "rxjs";

import type {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import type { TagMap } from "../../reducers/tags/tags-types";
import { translations } from "../../translations/translations";
import { createAsyncWorkerForChildProcessControllerFactory } from "../../utils/async-worker/child-process";
import { backgroundWorkerProcess$ } from "../../utils/batch-process";
import type {
  ErrorMessage,
  ResultMessage,
} from "../../utils/batch-process/types";

export interface GenerateCsvExportOptions {
  aliases: AliasMap;
  comments: CommentsMap;
  elementsToDelete?: string[];
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  hashes?: HashesMap;
  tags: TagMap;
}

/**
 * Asynchronously generates a csv export
 * @param data
 * @returns an observable that emits each time a file is computed and emits the export string as the last value
 */
export const generateCsvExport$ = (
  data: GenerateCsvExportOptions
): Observable<ErrorMessage | ResultMessage> => {
  const { language } = translations;
  return backgroundWorkerProcess$(
    { ...data, language },
    createAsyncWorkerForChildProcessControllerFactory(
      "exporters/csv/csv-exporter.fork.ts"
    )
  );
};
