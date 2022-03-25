import type { HashesMap } from "@common/utils/hashes-types";
import type { Observable } from "rxjs";
import type { Writable } from "stream";

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
  InitializeMessage,
  ResultMessage,
} from "../../utils/batch-process/types";
import { MessageTypes } from "../../utils/batch-process/types";
import type { MessageSerializer } from "../../utils/child-process-stream";
import type { WithLanguage } from "../../utils/language/types";
import { stringifyCsvExporterOptionsToStream } from "./csv-exporter-serializer";

export interface GenerateCsvExportOptions {
  aliases: AliasMap;
  comments: CommentsMap;
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  hashes?: HashesMap;
  elementsToDelete?: string[];
  tags: TagMap;
}

const initMessageSerializer: MessageSerializer<InitializeMessage> = (
  stream: Writable,
  { data }: InitializeMessage
) => {
  stringifyCsvExporterOptionsToStream(
    stream,
    data as WithLanguage<GenerateCsvExportOptions>
  );
};

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
      "exporters/csv/csv-exporter.fork.ts",
      {
        messageSerializers: {
          [MessageTypes.INITIALIZE]: initMessageSerializer,
        },
      }
    )
  );
};
