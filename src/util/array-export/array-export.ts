import { compose } from "lodash/fp";
import { HashesMap } from "reducers/hashes/hashes-types";
import {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { TFunction } from "i18next";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { TagMap } from "reducers/tags/tags-types";
import { concat, from, interval, Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import {
  CellConfig,
  makeRowConfig,
} from "util/array-export/make-array-export-config";
import _ from "lodash";
import { getAllChildren } from "util/files-and-folders/file-and-folders-utils";
import { ROOT_FF_ID } from "reducers/files-and-folders/files-and-folders-selectors";

type CsvExporterData = {
  aliases: AliasMap;
  comments: CommentsMap;
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  elementsToDelete: string[];
  hashes?: HashesMap;
  tags: TagMap;
  translator: TFunction;
};

type WithRowConfig = { rowConfig: CellConfig[] };
type WithHashes = { hashes: HashesMap };
type WithIdsToDelete = { idsToDelete: string[] };

const CHUNK_SIZE = 1000;

const makeExportBody = ({
  rowConfig,
  filesAndFolders,
  filesAndFoldersMetadata,
  ...rest
}: CsvExporterData & WithRowConfig & WithHashes & WithIdsToDelete) => {
  const filesAndFoldersChunks = _.chunk(
    Object.values(filesAndFolders).filter(({ id }) => id !== ROOT_FF_ID),
    CHUNK_SIZE
  );

  return interval().pipe(
    take(filesAndFoldersChunks.length),
    map((index) => filesAndFoldersChunks[index]),
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
const getChildrenToDelete = (filesAndFolders, elementsToDelete) => {
  return _(elementsToDelete)
    .flatMap((elementToDelete) =>
      getAllChildren(filesAndFolders, elementToDelete)
    )
    .uniq()
    .value();
};

const prepareIdsToDelete = <
  T extends { filesAndFolders: FilesAndFoldersMap; elementsToDelete: string[] }
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
  hashes: data.hashes || {},
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
      WithRowConfig & {
        output: string[][];
      } & WithHashes &
      WithIdsToDelete
  ): Observable<string[][]> =>
    concat(from([params.output]), makeExportBody(params)),
  (params) => ({
    ...params,
    output: [params.rowConfig.map(({ title }) => title)],
  }),
  (params: CsvExporterData & WithRowConfig & WithHashes) =>
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
