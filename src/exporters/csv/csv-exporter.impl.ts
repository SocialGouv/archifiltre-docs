import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { TagMap } from "reducers/tags/tags-types";
import translations from "translations/translations";
import { WorkerMessageHandler } from "util/async-worker/async-worker-util";
import { MessageTypes } from "util/batch-process/batch-process-util-types";
import { arrayToCsv } from "util/csv/csv-util";
import { HashesMap } from "reducers/hashes/hashes-types";
import { exportToCsv } from "util/array-export/array-export";
import { tap, toArray } from "rxjs/operators";

type CsvExporterData = {
  aliases: AliasMap;
  comments: CommentsMap;
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  elementsToDelete: string[];
  hashes?: HashesMap;
  tags: TagMap;
};

/**
 * Handles the initialize message for the CSV exporter fork
 * @param asyncWorker - The async worker instance
 * @param aliases
 * @param comments
 * @param elementsToDelete
 * @param filesAndFolders
 * @param filesAndFoldersMetadata
 * @param hashes
 * @param language
 * @param tags
 */
export const onInitialize: WorkerMessageHandler = async (
  asyncWorker,
  {
    aliases,
    comments,
    elementsToDelete = [],
    filesAndFolders,
    filesAndFoldersMetadata,
    hashes,
    tags,
  }: CsvExporterData
) => {
  const array = await exportToCsv({
    aliases,
    comments,
    elementsToDelete,
    filesAndFolders,
    filesAndFoldersMetadata,
    hashes,
    tags,
    translator: translations.t.bind(translations),
  })
    .pipe(
      tap((row) =>
        asyncWorker.postMessage({
          result: row[0],
          type: MessageTypes.RESULT,
        })
      )
    )
    .pipe(toArray())
    .toPromise();

  asyncWorker.postMessage({
    result: arrayToCsv(array),
    type: MessageTypes.RESULT,
  });

  asyncWorker.postMessage({
    type: MessageTypes.COMPLETE,
  });
};
