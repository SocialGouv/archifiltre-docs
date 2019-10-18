import { readFileSync } from "util/file-sys-util";

import * as FilesAndFolders from "datastore/files-and-folders";
import { fromAnyJsonToJs } from "compatibility";

import version from "version";

/**
 * Remove the byte order mark
 * Until v10, json files were generated with a
 * byte order mark at their start
 * We upgrade file-saver from 1.3.3 to 2.0.2,
 * they are not anymore generated with a byte order mark
 * @param content
 */
const removeByteOrderMark = content =>
  content[0] !== "{" ? content.slice(1) : content;

/**
 * Loads a preexisting saved config
 * @param droppedFolderPath
 */
function loadJsonConfig(droppedFolderPath) {
  const content = readFileSync(droppedFolderPath, "utf8");
  const contentWithoutByteOrderMark = removeByteOrderMark(content);

  const [js, jsVersion] = fromAnyJsonToJs(contentWithoutByteOrderMark);

  let filesAndFolders = FilesAndFolders.fromJs(js.files_and_folders);

  if (jsVersion !== version) {
    postMessage({ status: "derivate" });
    filesAndFolders = FilesAndFolders.computeDerived(filesAndFolders);
  }

  postMessage({
    status: "return",
    vfs: {
      ...js,
      files_and_folders: FilesAndFolders.toJs(filesAndFolders)
    }
  });
}

onmessage = ({ data: { droppedElementPath } }) => {
  loadJsonConfig(droppedElementPath);
};
