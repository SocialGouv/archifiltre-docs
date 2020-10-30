import translations from "translations/translations";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { backgroundWorkerProcess$ } from "util/batch-process/batch-process-util";
import TreeCsvExporterFork from "./tree-csv-exporter.fork";

/**
 * Asynchronously generates a tree csv export
 * @returns an observable that emits each time a file is computed and emits the export string as the last value
 * @param filesAndFoldersMap
 */
export const generateTreeCsvExport$ = (
  filesAndFoldersMap: FilesAndFoldersMap
) => {
  const { language } = translations;
  return backgroundWorkerProcess$(
    { filesAndFoldersMap, language },
    TreeCsvExporterFork
  );
};
