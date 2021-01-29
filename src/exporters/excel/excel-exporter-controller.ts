import translations from "translations/translations";
import { backgroundWorkerProcess$ } from "util/batch-process/batch-process-util";
import { CsvExporterData } from "exporters/csv/csv-exporter.impl";
import { createAsyncWorkerForChildProcessControllerFactory } from "util/async-worker/child-process";
import {
  InitializeMessage,
  MessageTypes,
} from "util/batch-process/batch-process-util-types";
import { stringifyCsvExporterOptionsToStream } from "exporters/csv/csv-exporter-serializer";

const initMessageSerializer = (stream, { data }: InitializeMessage) =>
  stringifyCsvExporterOptionsToStream(stream, data);

const messageSerializers = {
  [MessageTypes.INITIALIZE]: initMessageSerializer,
};

export const generateExcelExport$ = (data: CsvExporterData) => {
  const { language } = translations;

  return backgroundWorkerProcess$(
    { ...data, language },
    createAsyncWorkerForChildProcessControllerFactory("excel-exporter.fork", {
      messageSerializers,
    })
  );
};
