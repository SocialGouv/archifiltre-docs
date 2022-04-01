import { arrayToCsv } from "@common/utils/csv";
import type { HashesMap } from "@common/utils/hashes-types";
import { flatten } from "lodash";
import { tap, toArray } from "rxjs/operators";

import type {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import type { TagMap } from "../../reducers/tags/tags-types";
import { translations } from "../../translations/translations";
import { exportToCsv } from "../../utils/array-export/array-export";
import type { AsyncWorker } from "../../utils/async-worker";
import { MessageTypes } from "../../utils/batch-process/types";

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