import { type TFunction } from "i18next";
import { flatten } from "lodash";
import { Observable } from "rxjs";
import { tap, toArray } from "rxjs/operators";
import { utils, write } from "xlsx";

import { translations } from "../../translations/translations";
import { exportToCsv } from "../../utils/array-export/array-export";
import { type ErrorMessage, MessageTypes, type ResultMessage } from "../../utils/batch-process/types";
import { computeTreeStructureArray } from "../../utils/tree-representation";
import { type CsvExportData } from "../csv/csv-exporter-types";
import {
  type CreateExcelWorkbookParams,
  CSV_EXPORT_PROGRESS_WEIGHT,
  TREE_CSV_PROGRESS_WEIGHT,
} from "./excel-exporter-common";

const createExcelWorkbook = ({ treeCsv, csvArray }: CreateExcelWorkbookParams, translator: TFunction) => {
  const workbook = utils.book_new();
  const csvWorkSheet = utils.aoa_to_sheet(csvArray);
  const treeCsvWorkSheet = utils.aoa_to_sheet(treeCsv);
  utils.book_append_sheet(workbook, csvWorkSheet, translator("export.treeStats"));
  utils.book_append_sheet(workbook, treeCsvWorkSheet, translator("export.treeVisualizing"));
  return workbook;
};

export const generateExcelExport$ = (data: CsvExportData): Observable<ErrorMessage | ResultMessage> => {
  return new Observable<ErrorMessage | ResultMessage>(subscriber => {
    const translator = translations.t.bind(translations);
    const treeCsvPromise = computeTreeStructureArray(data.filesAndFolders)
      .pipe(
        tap(lines => {
          subscriber.next({
            result: TREE_CSV_PROGRESS_WEIGHT * lines.length,
            type: MessageTypes.RESULT,
          });
        }),
        toArray(),
      )
      .toPromise()
      .then(flatten);

    const csvArrayPromise = exportToCsv({
      ...data,
      translator,
    })
      .pipe(
        tap(lines => {
          subscriber.next({
            result: CSV_EXPORT_PROGRESS_WEIGHT * lines.length,
            type: MessageTypes.RESULT,
          });
        }),
        toArray(),
      )
      .toPromise()
      .then(flatten);

    void Promise.all([treeCsvPromise, csvArrayPromise]).then(([treeCsv, csvArray]) => {
      const xlsxWorkbook = createExcelWorkbook({ csvArray, treeCsv }, translator);

      const binaryXlsx = write(xlsxWorkbook, {
        type: "binary",
      });

      subscriber.next({
        result: binaryXlsx,
        type: MessageTypes.RESULT,
      });
      subscriber.complete();
    });
  });
};
