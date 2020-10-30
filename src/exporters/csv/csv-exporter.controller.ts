import translations from "translations/translations";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { TagMap } from "reducers/tags/tags-types";
import { backgroundWorkerProcess$ } from "util/batch-process/batch-process-util";
import CsvExporterFork from "./csv-exporter.fork";
import { HashesMap } from "reducers/hashes/hashes-types";

export interface GenerateCsvExportOptions {
  aliases: AliasMap;
  comments: CommentsMap;
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  hashes?: HashesMap;
  elementsToDelete?: string[];
  tags: TagMap;
}

/**
 * Asynchronously generates a csv export
 * @param data
 * @returns an observable that emits each time a file is computed and emits the export string as the last value
 */
export const generateCsvExport$ = (data: GenerateCsvExportOptions) => {
  const { language } = translations;
  return backgroundWorkerProcess$({ ...data, language }, CsvExporterFork);
};
