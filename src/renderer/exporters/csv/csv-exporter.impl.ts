import { exportToCsv } from "@common/utils/array-export/array-export";
import type { AsyncWorker } from "@common/utils/async-worker/async-worker-util";
import { MessageTypes } from "@common/utils/batch-process/batch-process-util-types";
import { arrayToCsv } from "@common/utils/csv/csv-util";
import { flatten } from "lodash";
import { tap, toArray } from "rxjs/operators";

import type {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import type { HashesMap } from "../../reducers/hashes/hashes-types";
import type { TagMap } from "../../reducers/tags/tags-types";
import { translations } from "../../translations/translations";

export interface CsvExporterData {
  aliases: AliasMap;
  comments: CommentsMap;
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  elementsToDelete: string[];
  hashes?: HashesMap;
  tags: TagMap;
}

/**
 * Handles the initialize message for the CSV exporter fork
 */
export const onInitialize = async (
  asyncWorker: AsyncWorker,
  {
    aliases,
    comments,
    elementsToDelete = [],
    filesAndFolders,
    filesAndFoldersMetadata,
    hashes,
    tags,
  }: CsvExporterData
): Promise<void> => {
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
      tap((row: string[][]) => {
        asyncWorker.postMessage({
          result: row.length,
          type: MessageTypes.RESULT,
        });
      }),
      toArray()
    )
    .toPromise()
    .then(flatten);

  asyncWorker.postMessage({
    result: arrayToCsv(array),
    type: MessageTypes.RESULT,
  });

  asyncWorker.postMessage({
    type: MessageTypes.COMPLETE,
  });
};
