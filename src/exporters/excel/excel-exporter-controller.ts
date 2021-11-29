import type { CsvExporterData } from "exporters/csv/csv-exporter.impl";
import { stringifyCsvExporterOptionsToStream } from "exporters/csv/csv-exporter-serializer";
import translations from "translations/translations";
import { createAsyncWorkerForChildProcessControllerFactory } from "util/async-worker/child-process";
import { backgroundWorkerProcess$ } from "util/batch-process/batch-process-util";
import type { InitializeMessage } from "util/batch-process/batch-process-util-types";
import { MessageTypes } from "util/batch-process/batch-process-util-types";

const initMessageSerializer = (stream, { data }: InitializeMessage) =>
    stringifyCsvExporterOptionsToStream(stream, data);

const messageSerializers = {
    [MessageTypes.INITIALIZE]: initMessageSerializer,
};

export const generateExcelExport$ = (data: CsvExporterData) => {
    const { language } = translations;

    return backgroundWorkerProcess$(
        { ...data, language },
        createAsyncWorkerForChildProcessControllerFactory(
            "excel-exporter.fork",
            {
                messageSerializers,
            }
        )
    );
};
