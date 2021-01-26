import translations from "translations/translations";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { backgroundWorkerProcess$ } from "util/batch-process/batch-process-util";
import { createAsyncWorkerForChildProcessControllerFactory } from "util/async-worker/child-process";
import {
  InitializeMessage,
  MessageTypes,
} from "util/batch-process/batch-process-util-types";
import { stringifyTreeCsvExporterOptionsToStream } from "exporters/csv/tree-csv-exporter-serializer";

const initMessageSerializer = (stream, { data }: InitializeMessage) =>
  stringifyTreeCsvExporterOptionsToStream(stream, data);

const messageSerializers = {
  [MessageTypes.INITIALIZE]: initMessageSerializer,
};

/**
 * Asynchronously generates a tree csv export
 * @returns an observable that emits each time a file is computed and emits the export string as the last value
 * @param filesAndFolders
 */
export const generateTreeCsvExport$ = (filesAndFolders: FilesAndFoldersMap) => {
  const { language } = translations;
  return backgroundWorkerProcess$(
    { filesAndFolders, language },
    createAsyncWorkerForChildProcessControllerFactory(
      "tree-csv-exporter.fork",
      {
        messageSerializers,
      }
    )
  );
};
