import type { Observable } from "rxjs";
import type { Writable } from "stream";

import { translations } from "../../translations/translations";
import { createAsyncWorkerForChildProcessControllerFactory } from "../../utils/async-worker/child-process";
import { backgroundWorkerProcess$ } from "../../utils/batch-process";
import type {
  ErrorMessage,
  InitializeMessage,
  ResultMessage,
} from "../../utils/batch-process/types";
import { MessageTypes } from "../../utils/batch-process/types";
import type { WithLanguage } from "../../utils/language/types";
import type { GenerateCsvExportOptions } from "../csv/csv-exporter.controller";
import type { CsvExporterData } from "../csv/csv-exporter.impl";
import { stringifyCsvExporterOptionsToStream } from "../csv/csv-exporter-serializer";

const initMessageSerializer = (
  stream: Writable,
  { data }: InitializeMessage
) => {
  stringifyCsvExporterOptionsToStream(
    stream,
    data as WithLanguage<GenerateCsvExportOptions>
  );
};

const messageSerializers = {
  [MessageTypes.INITIALIZE]: initMessageSerializer,
};

export const generateExcelExport$ = (
  data: CsvExporterData
): Observable<ErrorMessage | ResultMessage> => {
  const { language } = translations;

  return backgroundWorkerProcess$(
    { ...data, language },
    createAsyncWorkerForChildProcessControllerFactory("excel-exporter.fork", {
      messageSerializers,
    })
  );
};
