import translations from "translations/translations";
import { createAsyncWorkerControllerClass } from "util/async-worker/async-worker-util";
import ExcelExporterWorker from "./excel-exporter.fork";
import { backgroundWorkerProcess$ } from "util/batch-process/batch-process-util";
import { CsvExporterData } from "exporters/csv/csv-exporter.impl";

export const generateExcelExport$ = (data: CsvExporterData) => {
  const { language } = translations;

  const Worker = createAsyncWorkerControllerClass(ExcelExporterWorker);

  return backgroundWorkerProcess$({ ...data, language }, Worker);
};
