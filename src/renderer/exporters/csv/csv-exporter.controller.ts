import { arrayToCsv } from "@common/utils/csv";
import { type Observable } from "rxjs";

import { generateArrayExport$ } from "../../utils/array-export/array-export";
import { type ResultMessage } from "../../utils/batch-process/types";
import { type CsvExportData } from "./csv-exporter-types";

/**
 * Asynchronously generates a csv export
 * @param data
 * @returns an observable that emits each time a file is computed and emits the export string as the last value
 */
export const generateCsvExport$ = (data: CsvExportData): Observable<ResultMessage> =>
  generateArrayExport$(data, arrayToCsv);
