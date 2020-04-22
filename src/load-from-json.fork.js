import { readFileSync } from "util/file-system/file-sys-util";

import { fromAnyJsonToJs } from "util/compatibility/compatibility";

import {
  AsyncWorkerEvent,
  createAsyncWorkerForChildProcess,
} from "util/async-worker/async-worker-util";
import { MessageTypes } from "util/batch-process/batch-process-util-types";

const asyncWorker = createAsyncWorkerForChildProcess();

/**
 * Remove the byte order mark
 * Until v10, json files were generated with a
 * byte order mark at their start
 * We upgrade file-saver from 1.3.3 to 2.0.2,
 * they are not anymore generated with a byte order mark
 * @param content
 */
const removeByteOrderMark = (content) =>
  content[0] !== "{" ? content.slice(1) : content;

/**
 * Loads a preexisting saved config
 * @param droppedFolderPath
 */
function loadJsonConfig(droppedFolderPath) {
  const content = readFileSync(droppedFolderPath, "utf8");
  const contentWithoutByteOrderMark = removeByteOrderMark(content);

  const js = fromAnyJsonToJs(contentWithoutByteOrderMark);

  asyncWorker.postMessage({
    type: MessageTypes.COMPLETE,
    message: {
      vfs: js,
    },
  });
}

asyncWorker.addEventListener(
  AsyncWorkerEvent.MESSAGE,
  ({ droppedElementPath }) => {
    loadJsonConfig(droppedElementPath);
  }
);

export default {};
