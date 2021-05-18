import {AsyncWorker} from "./async-worker-util";
import {MessageTypes} from "../batch-process/batch-process-util-types";

export const logInfo = (asyncWorker: AsyncWorker) => (data: string) => {
    asyncWorker.postMessage({
        type: MessageTypes.LOG,
        data
    });
}