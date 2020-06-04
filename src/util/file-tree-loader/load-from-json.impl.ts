import { AsyncWorker } from "../async-worker/async-worker-util";
import { readFileSync } from "../file-system/file-sys-util";
import { fromAnyJsonToJs } from "../compatibility/compatibility";
import { MessageTypes } from "../batch-process/batch-process-util-types";

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

export const onInitialize = (asyncWorker: AsyncWorker, jsonPath: string) => {
  const content = readFileSync(jsonPath, "utf8");
  const contentWithoutByteOrderMark = removeByteOrderMark(content);

  const js = fromAnyJsonToJs(contentWithoutByteOrderMark);

  asyncWorker.postMessage({
    type: MessageTypes.COMPLETE,
    result: {
      vfs: js,
    },
  });
};
