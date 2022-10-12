import { IS_WORKER } from "@common/config";
import sourceMapSupport from "source-map-support";

import { translations } from "../../translations/translations";
import { WorkerEventType } from "../../utils/async-worker";
import { createAsyncWorkerForChildProcess } from "../../utils/async-worker/child-process";
import { MessageTypes } from "../../utils/batch-process/types";
import { hookCounter } from "../../utils/hook";
import { resipExporter } from "./resip-exporter";

if (IS_WORKER) {
  sourceMapSupport.install();
  const asyncWorker = createAsyncWorkerForChildProcess();

  asyncWorker.addEventListener(
    WorkerEventType.MESSAGE,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ type, data }: any) => {
      if (type === "initialize") {
        const messageHook = (count?: number) => {
          asyncWorker.postMessage({
            result: { count, resipCsv: [] },
            type: MessageTypes.RESULT,
          });
        };
        const { hook, getCount } = hookCounter(messageHook);

        const { language, ...props } = data;
        await translations.changeLanguage(language as string);
        console.log(props.sedaMetadata);
        const resipExportData = resipExporter(
          {
            ...props,
          },
          hook
        );

        asyncWorker.postMessage({
          result: { count: getCount(), resipCsv: resipExportData },
          type: MessageTypes.RESULT,
        });

        asyncWorker.postMessage({
          type: MessageTypes.COMPLETE,
        });
      }
    }
  );
}
