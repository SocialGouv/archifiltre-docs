import { createAsyncWorkerForChildProcessControllerFactory } from "@common/utils/async-worker/child-process";
import { backgroundWorkerProcess$ } from "@common/utils/batch-process/batch-process-util";
import type {
  ErrorMessage,
  InitializeMessage,
  ResultMessage,
} from "@common/utils/batch-process/batch-process-util-types";
import { MessageTypes } from "@common/utils/batch-process/batch-process-util-types";
import type { Observable } from "rxjs";
import type { Writable } from "stream";

import type { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { translations } from "../../translations/translations";
import type { TreeCsvExporterParams } from "./tree-csv-exporter-serializer";
import { stringifyTreeCsvExporterOptionsToStream } from "./tree-csv-exporter-serializer";

const initMessageSerializer = (
  stream: Writable,
  { data }: InitializeMessage
) => {
  stringifyTreeCsvExporterOptionsToStream(
    stream,
    data as TreeCsvExporterParams
  );
};

const messageSerializers = {
  [MessageTypes.INITIALIZE]: initMessageSerializer,
};

/**
 * Asynchronously generates a tree csv export
 * @returns an observable that emits each time a file is computed and emits the export string as the last value
 * @param filesAndFolders
 */
export const generateTreeCsvExport$ = (
  filesAndFolders: FilesAndFoldersMap
): Observable<ErrorMessage | ResultMessage> => {
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
