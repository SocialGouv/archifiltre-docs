import type { Observable } from "rxjs";

import { translations } from "../../translations/translations";
import { createAsyncWorkerForChildProcessControllerFactory } from "../../utils/async-worker/child-process";
import { backgroundWorkerProcess$ } from "../../utils/batch-process";
import type {
  ErrorMessage,
  ResultMessage,
} from "../../utils/batch-process/types";
import type { CsvExporterData } from "../csv/csv-exporter.impl";

export const generateExcelExport$ = (
  data: CsvExporterData
): Observable<ErrorMessage | ResultMessage> => {
  const { language } = translations;

  return backgroundWorkerProcess$(
    { ...data, language },
    createAsyncWorkerForChildProcessControllerFactory(
      "exporters/excel/excel-exporter.fork.ts"
    )
  );
};
