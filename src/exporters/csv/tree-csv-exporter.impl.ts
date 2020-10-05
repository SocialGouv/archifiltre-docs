import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { WorkerMessageHandler } from "util/async-worker/async-worker-util";
import { MessageTypes } from "util/batch-process/batch-process-util-types";
import { arrayToCsv } from "util/csv/csv-util";
import { computeTreeStructureArray } from "util/tree-representation/tree-representation";
import { tap, toArray } from "rxjs/operators";

interface CsvExporterData {
  filesAndFoldersMap: FilesAndFoldersMap;
}

/**
 * Handles the initialize message for the CSV exporter fork
 * @param asyncWorker - The async worker instance
 * @param filesAndFolders
 * @param language
 */
export const onInitialize: WorkerMessageHandler = async (
  asyncWorker,
  { filesAndFoldersMap }: CsvExporterData
) => {
  const header = [""];
  const lines = await computeTreeStructureArray(filesAndFoldersMap)
    .pipe(
      tap((lineComputed) => {
        asyncWorker.postMessage({
          result: lineComputed,
          type: MessageTypes.RESULT,
        });
      })
    )
    .pipe(toArray())
    .toPromise();

  asyncWorker.postMessage({
    result: arrayToCsv([header, ...lines]),
    type: MessageTypes.RESULT,
  });

  asyncWorker.postMessage({
    type: MessageTypes.COMPLETE,
  });
};
