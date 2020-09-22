import { getLanguage } from "languages";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { createAsyncWorkerControllerClass } from "util/async-worker/async-worker-util";
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
  const language = getLanguage()[0];
  const TreeCsvExporterAsyncWorker = createAsyncWorkerControllerClass(
    TreeCsvExporterFork
  );
  return backgroundWorkerProcess$(
    { filesAndFoldersMap, language },
    TreeCsvExporterAsyncWorker
  );
};
