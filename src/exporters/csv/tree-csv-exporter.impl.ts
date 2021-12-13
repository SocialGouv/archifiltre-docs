import { flatten } from "lodash";
import { tap, toArray } from "rxjs/operators";

import type { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import type {
    AsyncWorker,
    WorkerEventType,
} from "../../util/async-worker/async-worker-util";
import { MessageTypes } from "../../util/batch-process/batch-process-util-types";
import { arrayToCsv } from "../../util/csv/csv-util";
import { computeTreeStructureArray } from "../../util/tree-representation/tree-representation";

interface CsvExporterData {
    filesAndFolders: FilesAndFoldersMap;
}

/**
 * Handles the initialize message for the CSV exporter fork
 */
export const onInitialize = async (
    asyncWorker: AsyncWorker<WorkerEventType.MESSAGE>,
    { filesAndFolders }: CsvExporterData
): Promise<void> => {
    const header = [""];
    const lines = await computeTreeStructureArray(filesAndFolders)
        .pipe(
            tap((lineComputed) => {
                asyncWorker.postMessage({
                    result: lineComputed.length,
                    type: MessageTypes.RESULT,
                });
            }),
            toArray()
        )
        .toPromise()
        .then(flatten);

    asyncWorker.postMessage({
        result: arrayToCsv([header, ...lines]),
        type: MessageTypes.RESULT,
    });

    asyncWorker.postMessage({
        type: MessageTypes.COMPLETE,
    });
};
