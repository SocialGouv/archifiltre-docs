import translations from "translations/translations";
import ExcelExporterWorker from "./excel-exporter.fork";
import { backgroundWorkerProcess$ } from "util/batch-process/batch-process-util";
import { CsvExporterData } from "exporters/csv/csv-exporter.impl";

export const generateExcelExport$ = (data: CsvExporterData) => {
  const { language } = translations;

  return backgroundWorkerProcess$({ ...data, language }, ExcelExporterWorker);
};
