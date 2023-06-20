import type { HashesMap } from "@common/utils/hashes-types";
import type { TFunction } from "i18next";
import _, { flatten } from "lodash";
import { compose, cond, defaults, isObject, prop, stubTrue } from "lodash/fp";
import { concat, from, interval, Observable } from "rxjs";
import { map, take, tap, toArray } from "rxjs/operators";

import type { GenerateCsvExportOptions } from "../../exporters/csv/csv-exporter.controller";
import { ROOT_FF_ID } from "../../reducers/files-and-folders/files-and-folders-selectors";
import type {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import type { TagMap } from "../../reducers/tags/tags-types";
import { translations } from "../../translations/translations";
import type { ResultMessage } from "../batch-process/types";
import { MessageTypes } from "../batch-process/types";
import type { DuplicatesMap } from "../duplicates";
import { getDuplicatesMap } from "../duplicates";
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

const prepareDuplicateMap = <
  T extends {
    hashes: HashesMap;
  }
>(
  params: T
  // @ts-expect-error for testing purpose
): T & { duplicatesMap: DuplicatesMap } => ({
  ...params,
  duplicatesMap: getDuplicatesMap(params.hashes),
});

const shouldDisplayDuplicates = (hashes?: HashesMap) =>
  isObject(hashes) && Object.keys(hashes).length > 0;

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

const setDefaultHashesValue = <T>(params: T) =>
  defaults({ hashes: {} }, params);

const maybeRemoveDuplicates = cond([
  [
    compose(shouldDisplayDuplicates, prop("hashes")),
    (input: CsvExporterData & WithRowConfig) => input,
  ],
  [stubTrue, removeDuplicateCells],
]);

const addRowConfig = (csvExporterData: CsvExporterData) => ({
  rowConfig: makeRowConfig(csvExporterData.translator, csvExporterData.tags),
  ...csvExporterData,
});

const generateHeaderRow = <T extends WithRowConfig>(params: T) => ({
  ...params,
  output: [params.rowConfig.map(({ title }) => title)],
});

const computeExportRows = (
  params: CsvExporterData &
    WithHashes &
    WithIdsToDelete &
    WithRowConfig & {
      output: string[][];
    }
): Observable<string[][]> =>
  concat(from([params.output]), makeExportBody(params));

export const exportToCsv: (input: CsvExporterData) => Observable<string[][]> =
  compose(
    computeExportRows,
    generateHeaderRow,
    prepareIdsToDelete,
    prepareDuplicateMap,
    setDefaultHashesValue,
    removeToDeleteCells,
    maybeRemoveDuplicates,
    addRowConfig
  );

export const generateArrayExport$ = (
  data: GenerateCsvExportOptions,
  outputFormatter: (matrix: string[][]) => string
): Observable<ResultMessage> => {
  return new Observable<ResultMessage>((subscriber) => {
    void exportToCsv({
      ...data,
      elementsToDelete: data.elementsToDelete ?? [],
      translator: translations.t.bind(translations),
    })
      .pipe(
        tap((row: string[][]) => {
          subscriber.next({
            result: row.length,
            type: MessageTypes.RESULT,
          });
        }),
        toArray()
      )
      .toPromise()
      .then(flatten)
      .then((array) => {
        subscriber.next({
          result: outputFormatter(array),
          type: MessageTypes.RESULT,
        });

        subscriber.complete();
      });
  });
};
