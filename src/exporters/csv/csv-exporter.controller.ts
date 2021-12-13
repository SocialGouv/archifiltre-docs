import type { Observable } from "rxjs";
import type { Writable } from "stream";

import type {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import type { HashesMap } from "../../reducers/hashes/hashes-types";
import type { TagMap } from "../../reducers/tags/tags-types";
import { translations } from "../../translations/translations";
import { createAsyncWorkerForChildProcessControllerFactory } from "../../util/async-worker/child-process";
import { backgroundWorkerProcess$ } from "../../util/batch-process/batch-process-util";
import type {
  ErrorMessage,
  InitializeMessage,
  ResultMessage,
} from "../../util/batch-process/batch-process-util-types";
import { MessageTypes } from "../../util/batch-process/batch-process-util-types";
import type { MessageSerializer } from "../../util/child-process-stream/child-process-stream";
import type { WithLanguage } from "../../util/language/language-types";
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
    createAsyncWorkerForChildProcessControllerFactory("csv-exporter.fork", {
      messageSerializers: {
        [MessageTypes.INITIALIZE]: initMessageSerializer,
      },
    })
  );
};
