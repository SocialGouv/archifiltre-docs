import translations from "translations/translations";
import { backgroundWorkerProcess$ } from "util/batch-process/batch-process-util";
import { CsvExporterData } from "exporters/csv/csv-exporter.impl";
import { createAsyncWorkerForChildProcessControllerFactory } from "util/async-worker/child-process";

export const generateExcelExport$ = (data: CsvExporterData) => {
  const { language } = translations;

  return backgroundWorkerProcess$(
    { ...data, language },
    createAsyncWorkerForChildProcessControllerFactory("excel-exporter.fork")
  );
};
