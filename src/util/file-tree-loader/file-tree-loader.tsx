import LoadFromFileSystemWorker from "./load-from-filesystem.fork";
import {
  AsyncWorkerEvent,
  createAsyncWorkerForChildProcessController,
} from "../async-worker/async-worker-util";
import { MessageTypes } from "../batch-process/batch-process-util-types";
import {
  ArchifiltreError,
  ArchifiltreErrorType,
} from "reducers/loading-info/loading-info-types";
import { reportError, reportInfo, reportWarning } from "logging/reporter";
import { createArchifiltreError } from "reducers/loading-info/loading-info-selectors";
import { VirtualFileSystem } from "files-and-folders-loader/files-and-folders-loader-types";

type LoadFileTreeHook = (error: null | ArchifiltreError, data?: any) => void;

export const loadFileTree = async (
  droppedElementPath: string,
  hook: LoadFileTreeHook
): Promise<VirtualFileSystem> =>
  new Promise((resolve, reject) => {
    const asyncWorker = createAsyncWorkerForChildProcessController(
      new LoadFromFileSystemWorker()
    );

    asyncWorker.addEventListener(AsyncWorkerEvent.MESSAGE, (event) => {
      switch (event.type) {
        case MessageTypes.COMPLETE:
          reportInfo({
            path: droppedElementPath,
            type: "elementLoadedSuccessfully",
          });
          asyncWorker.terminate();
          resolve(event.data.result.vfs);
          break;
        case MessageTypes.FATAL:
          asyncWorker.terminate();
          reject(event.data.error);
          reportError(event.data.error);
          break;
        case MessageTypes.ERROR:
          reportError(event.data.error);
          hook(
            createArchifiltreError({
              type: ArchifiltreErrorType.LOADING_FILE_SYSTEM,
              filePath: event.data.error.path,
              reason: event.data.error.error,
              code: event.data.error.code,
            })
          );
          break;
        case MessageTypes.WARNING:
          reportWarning(event.data.warning);
          break;
        case MessageTypes.RESULT:
          hook(null, event.data.result);
          break;
      }
    });

    asyncWorker.postMessage({
      type: MessageTypes.INITIALIZE,
      data: droppedElementPath,
    });
  });
