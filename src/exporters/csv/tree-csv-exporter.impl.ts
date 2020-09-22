import { getFilesAndFoldersDepth } from "reducers/files-and-folders/files-and-folders-selectors";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import translations from "translations/translations";
import { WorkerMessageHandler } from "util/async-worker/async-worker-util";
import { MessageTypes } from "util/batch-process/batch-process-util-types";
import { arrayToCsv } from "util/csv/csv-util";

interface CsvExporterData {
  filesAndFoldersMap: FilesAndFoldersMap;
  language: string;
}

/**
 * Handles the initialize message for the CSV exporter fork
 * @param asyncWorker - The async worker instance
 * @param filesAndFolders
 * @param language
 */
export const onInitialize: WorkerMessageHandler = async (
  asyncWorker,
  { filesAndFoldersMap, language }: CsvExporterData
) => {
  await translations.changeLanguage(language);
  const header = [""];
  const lines = Object.keys(filesAndFoldersMap)
    .sort((firstElement, secondElement) => {
      const firstVirtualPath = filesAndFoldersMap[firstElement].virtualPath;
      const secondVirtualPath = filesAndFoldersMap[secondElement].virtualPath;
      if (firstVirtualPath === secondVirtualPath) {
        return 0;
      }
      return firstVirtualPath > secondVirtualPath ? 1 : -1;
    })
    .map((ffId) => {
      const { virtualPath, name } = filesAndFoldersMap[ffId];
      const depth = getFilesAndFoldersDepth(virtualPath);
      const shiftArray = depth <= 0 ? [] : new Array(depth).fill("");
      return [...shiftArray, name];
    });

  asyncWorker.postMessage({
    result: arrayToCsv([header, ...lines]),
    type: MessageTypes.RESULT,
  });

  asyncWorker.postMessage({
    type: MessageTypes.COMPLETE,
  });
};
