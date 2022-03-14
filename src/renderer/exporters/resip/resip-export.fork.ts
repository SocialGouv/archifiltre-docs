import { WorkerEventType } from "@common/utils/async-worker/async-worker-util";
import { createAsyncWorkerForChildProcess } from "@common/utils/async-worker/child-process";
import { MessageTypes } from "@common/utils/batch-process/batch-process-util-types";
import { hookCounter } from "@common/utils/hook/hook-utils";

import { translations } from "../../translations/translations";
import { resipExporter } from "./resip-exporter";

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

      const {
        aliases,
        comments,
        elementsToDelete,
        filesAndFolders,
        filesAndFoldersMetadata,
        tags,
        language,
      } = data;
      await translations.changeLanguage(language as string);

      const resipExportData = resipExporter(
        {
          aliases,
          comments,
          elementsToDelete,
          filesAndFolders,
          filesAndFoldersMetadata,
          tags,
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
