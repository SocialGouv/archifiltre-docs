import translations from "translations/translations";
import {
  createAsyncWorkerForChildProcess,
  fakeChildProcess,
  WorkerEventType,
} from "util/async-worker/async-worker-util";
import { MessageTypes } from "util/batch-process/batch-process-util-types";
import { hookCounter } from "util/hook/hook-utils";
import resipExporter from "./resip-exporter";

const asyncWorker = createAsyncWorkerForChildProcess();

asyncWorker.addEventListener(
  WorkerEventType.MESSAGE,
  async ({ type, data }: any) => {
    if (type === "initialize") {
      const messageHook = (count) => {
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
      await translations.changeLanguage(language);

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

export default fakeChildProcess;
