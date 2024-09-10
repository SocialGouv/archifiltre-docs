import type { HashesMap } from "@common/utils/hashes-types";
import type { TFunction } from "i18next";
import _, { flatten, identity } from "lodash";
import { compose, cond, defaults, isObject, prop, stubTrue } from "lodash/fp";
import { concat, from, interval, Observable } from "rxjs";
import { map, take, tap, toArray } from "rxjs/operators";

import type { CsvExportData } from "../../exporters/csv/csv-exporter-types";
import { ROOT_FF_ID } from "../../reducers/files-and-folders/files-and-folders-selectors";
import type { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { translations } from "../../translations/translations";
import type { ResultMessage } from "../batch-process/types";
import { MessageTypes } from "../batch-process/types";
import type { DuplicatesMap } from "../duplicates";
import { getDuplicatesMap } from "../duplicates";
import { getAllChildren } from "../file-and-folders";
import type { CellConfig } from "./make-array-export-config";
import { makeRowConfig } from "./make-array-export-config";

type CsvExporterData = CsvExportData & {
  translator: TFunction;
};

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

const shouldRemoveToDelete = (params: CsvExporterData & WithRowConfig) =>
  params.elementsToDelete.length === 0;

const removeToDeleteCells = (
  params: CsvExporterData & WithRowConfig
): CsvExporterData & WithRowConfig => ({
  ...params,
  rowConfig: params.rowConfig.filter(({ id }) => id !== "toDelete"),
});

const maybeRemoveToDeleteCells = cond([
  [shouldRemoveToDelete, removeToDeleteCells],
  [stubTrue, identity],
]);

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
  rowConfig: makeRowConfig(csvExporterData.translator, csvExporterData),
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
    maybeRemoveToDeleteCells,
    maybeRemoveDuplicates,
    addRowConfig
  );

export const generateArrayExport$ = (
  data: CsvExportData,
  outputFormatter: (matrix: string[][]) => string
): Observable<ResultMessage> => {
  return new Observable<ResultMessage>((subscriber) => {
    void exportToCsv({
      ...data,
      elementsToDelete: data.elementsToDelete,
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

/**
 * Generates a CSV array export with only the elements marked for deletion.
 */
export const generateElementsToDeleteArrayExport$ = (
  data: CsvExportData
): Observable<ResultMessage> => {
  return new Observable<ResultMessage>((subscriber) => {
    const toDeleteTranslation = translations.t("csvHeader.toDelete"); // Dynamic translation for "To Delete"

    // Call exportToCsv with the full data to ensure the parent-children processing is done
    void exportToCsv({
      ...data,
      elementsToDelete: data.elementsToDelete,
      translator: translations.t.bind(translations),
    })
      .pipe(
        tap((row: string[][]) => {
          subscriber.next({
            result: row.length, // Progress: report how many rows are exported
            type: MessageTypes.RESULT,
          });
        }),
        toArray(), // Collect all rows into one array
        map((array) => {
          const flattenedArray = flatten(array);

          // Apply the filter after the parent-children structure is handled
          const filteredArray = flattenedArray.filter((row) => {
            // Assuming the last column holds the translated "to delete" status
            const lastColumnIndex = row.length - 1;
            const lastColumnValue = row[lastColumnIndex]?.trim(); // Get the value and trim spaces

            // Use the translation to match the correct "to delete" label
            return lastColumnValue === toDeleteTranslation;
          });

          return filteredArray;
        })
      )
      .toPromise()
      .then((filteredArray) => {
        // Format the filtered result into a CSV string
        const formattedResult = filteredArray
          .map((row) => row.join(";"))
          .join("\n");

        // Emit the final CSV string
        subscriber.next({
          result: formattedResult,
          type: MessageTypes.RESULT,
        });

        // Complete the observable
        subscriber.complete();
      });
  });
};
