import type { HashesMap } from "@common/utils/hashes-types";
import type { TFunction } from "i18next";
import _ from "lodash";
import { compose } from "lodash/fp";
import type { Observable } from "rxjs";
import { concat, from, interval } from "rxjs";
import { map, take } from "rxjs/operators";

import { ROOT_FF_ID } from "../../reducers/files-and-folders/files-and-folders-selectors";
import type {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import type { TagMap } from "../../reducers/tags/tags-types";
import { getAllChildren } from "../file-and-folders";
import type { CellConfig } from "./make-array-export-config";
import { makeRowConfig } from "./make-array-export-config";

interface CsvExporterData {
  aliases: AliasMap;
  comments: CommentsMap;
  elementsToDelete: string[];
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  hashes?: HashesMap;
  tags: TagMap;
  translator: TFunction;
}

interface WithRowConfig {
  rowConfig: CellConfig[];
}
interface WithHashes {
  hashes: HashesMap;
}
interface WithIdsToDelete {
  idsToDelete: string[];
}

const CHUNK_SIZE = 1000;

const makeExportBody = ({
  rowConfig,
  filesAndFolders,
  filesAndFoldersMetadata,
  ...rest
}: CsvExporterData & WithHashes & WithIdsToDelete & WithRowConfig) => {
  const filesAndFoldersChunks = _.chunk(
    Object.values(filesAndFolders).filter(({ id }) => id !== ROOT_FF_ID),
    CHUNK_SIZE
  );

  return interval().pipe(
    take(filesAndFoldersChunks.length),
    map((index) => filesAndFoldersChunks[index]!),
    map((chunk) =>
      chunk.map((element) =>
        rowConfig.map((cellConfig) =>
          cellConfig.accessor({
            ...element,
            ...filesAndFoldersMetadata[element.id],
            ...rest,
          })
        )
      )
    )
  );
};

/**
 * Get all children of elements to delete
 * @param filesAndFolders
 * @param elementsToDelete
 */
const getChildrenToDelete = (
  filesAndFolders: FilesAndFoldersMap,
  elementsToDelete: string[]
) => {
  return _(elementsToDelete)
    .flatMap((elementToDelete) =>
      getAllChildren(filesAndFolders, elementToDelete)
    )
    .uniq()
    .value();
};

const prepareIdsToDelete = <
  T extends {
    elementsToDelete: string[];
    filesAndFolders: FilesAndFoldersMap;
  }
>(
  params: T
): T & WithIdsToDelete => ({
  ...params,
  idsToDelete: getChildrenToDelete(
    params.filesAndFolders,
    params.elementsToDelete
  ),
});

const normalizeHashes = <T extends { hashes?: HashesMap }>(
  data: T
): T & WithHashes => ({
  ...data,
  hashes: data.hashes ?? {},
});

const shouldDisplayDuplicates = (hashes?: HashesMap) =>
  hashes && Object.keys(hashes).length > 0;

const removeDuplicateCells = (
  params: CsvExporterData & WithRowConfig
): CsvExporterData & WithRowConfig => ({
  ...params,
  rowConfig: params.rowConfig.filter(
    ({ id }) => !["hash", "duplicate"].includes(id)
  ),
});

const removeToDeleteCells = (
  params: CsvExporterData & WithRowConfig
): CsvExporterData & WithRowConfig => ({
  ...params,
  rowConfig: params.rowConfig.filter(({ id }) => id !== "toDelete"),
});

export const exportToCsv = compose(
  (
    params: CsvExporterData &
      WithHashes &
      WithIdsToDelete &
      WithRowConfig & {
        output: string[][];
      }
  ): Observable<string[][]> =>
    concat(from([params.output]), makeExportBody(params)),
  (params) => ({
    ...params,
    output: [params.rowConfig.map(({ title }) => title)],
  }),
  (params: CsvExporterData & WithHashes & WithRowConfig) =>
    prepareIdsToDelete(params),
  (params: CsvExporterData & WithRowConfig) => normalizeHashes(params),
  (params: CsvExporterData & WithRowConfig) =>
    params.elementsToDelete.length > 0 ? params : removeToDeleteCells(params),
  (params: CsvExporterData & WithRowConfig) =>
    shouldDisplayDuplicates(params.hashes)
      ? params
      : removeDuplicateCells(params),
  (csvExporterData: CsvExporterData) => ({
    rowConfig: makeRowConfig(csvExporterData.translator, csvExporterData.tags),
    ...csvExporterData,
  })
);
