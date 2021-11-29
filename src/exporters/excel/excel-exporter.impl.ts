import type { CsvExporterData } from "exporters/csv/csv-exporter.impl";
import type { TFunction } from "i18next";
import { flatten } from "lodash";
import { tap, toArray } from "rxjs/operators";
import translations from "translations/translations";
import { exportToCsv } from "util/array-export/array-export";
import type { AsyncWorker } from "util/async-worker/async-worker-util";
import { MessageTypes } from "util/batch-process/batch-process-util-types";
import { computeTreeStructureArray } from "util/tree-representation/tree-representation";
import { utils, write } from "xlsx";

const TREE_CSV_PROGRESS_WEIGHT = 1;
const CSV_EXPORT_PROGRESS_WEIGHT = 10;

export const getExcelExportProgressGoal = (filesAndFoldersCount: number) =>
    (TREE_CSV_PROGRESS_WEIGHT + CSV_EXPORT_PROGRESS_WEIGHT) *
    filesAndFoldersCount;

export interface CreateExcelWorkbookParams {
    treeCsv: string[][];
    csvArray: string[][];
}
const createExcelWorkbook = ({ treeCsv, csvArray }, translator: TFunction) => {
    const workbook = utils.book_new();
    const csvWorkSheet = utils.aoa_to_sheet(csvArray);
    const treeCsvWorkSheet = utils.aoa_to_sheet(treeCsv);
    utils.book_append_sheet(
        workbook,
        csvWorkSheet,
        translator("export.treeStats")
    );
    utils.book_append_sheet(
        workbook,
        treeCsvWorkSheet,
        translator("export.treeVisualizing")
    );
    return workbook;
};
export type ExportToExcelParams = CsvExporterData;

export const exportToExcel = async (
    worker: AsyncWorker,
    params: ExportToExcelParams
) => {
    const translator = translations.t.bind(translations);
    const treeCsv = await computeTreeStructureArray(params.filesAndFolders)
        .pipe(
            tap((lines) => {
                worker.postMessage({
                    result: TREE_CSV_PROGRESS_WEIGHT * lines.length,
                    type: MessageTypes.RESULT,
                });
            }),
            toArray()
        )
        .toPromise()
        .then(flatten);

    const csvArray = await exportToCsv({
        ...params,
        translator,
    })
        .pipe(
            tap((lines) => {
                worker.postMessage({
                    result: CSV_EXPORT_PROGRESS_WEIGHT * lines.length,
                    type: MessageTypes.RESULT,
                });
            }),
            toArray()
        )
        .toPromise()
        .then(flatten);

    const xlsxWorkbook = createExcelWorkbook({ csvArray, treeCsv }, translator);

    const binaryXlsx = write(xlsxWorkbook, {
        type: "binary",
    });

    worker.postMessage({
        result: binaryXlsx,
        type: MessageTypes.RESULT,
    });
    worker.postMessage({
        type: MessageTypes.COMPLETE,
    });
};
