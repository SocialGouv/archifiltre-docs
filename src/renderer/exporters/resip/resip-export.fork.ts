import { translations } from "../../translations/translations";
import { WorkerEventType } from "../../util/async-worker/async-worker-util";
import { createAsyncWorkerForChildProcess } from "../../util/async-worker/child-process";
import { MessageTypes } from "../../util/batch-process/batch-process-util-types";
import { hookCounter } from "../../util/hook/hook-utils";
import { resipExporter } from "./resip-exporter";

const asyncWorker = createAsyncWorkerForChildProcess();

asyncWorker.addEventListener(
  WorkerEventType.MESSAGE,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async ({ type, data }: any) => {
    if (type === "initialize") {
      const messageHook = (count: number | undefined) => {
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
