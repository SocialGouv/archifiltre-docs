import { traverseFileTree, isJsonFile, readFileSync } from "util/file-sys-util";

import * as VirtualFileSystem from "datastore/virtual-file-system";
import { fromAnyJsonToJs } from "compatibility";

import version from "version";
import { reportError, reportMessage } from "./reporter";
import { hookCounter } from "./util/hook-utils";

/**
 * Remove the byte order mark
 * Until v10, json files were generated with a
 * byte order mark at their start
 * We upgrade file-saver from 1.3.3 to 2.0.2,
 * they are not anymore generated with a byte order mark
 * @param content
 */
const removeByteOrderMark = content => {
  if (content[0] !== "{") {
    return content.slice(1);
  } else {
    return content;
  }
};

/**
 * Loads a preexisting saved config
 * @param dropped_folder_path
 */
function loadJsonConfig(dropped_folder_path) {
  const content = readFileSync(dropped_folder_path, "utf8");
  const content_without_byte_order_mark = removeByteOrderMark(content);

  const [js, js_version] = fromAnyJsonToJs(content_without_byte_order_mark);

  let vfs = VirtualFileSystem.fromJs(js);

  if (js_version !== version) {
    postMessage({ status: "derivate" });
    vfs = VirtualFileSystem.derivate(vfs);
  }

  postMessage({
    status: "return",
    vfs: VirtualFileSystem.toJs(vfs)
  });
}

/**
 * Recursively generates a file system from a dropped folder
 * @param folderPath
 */
function loadFolder(folderPath) {
  const MIN_MESSAGE_INTERVAL = 300;

  postMessage({ status: "traverse", count: 0 });
  const { hook: traverseHook, getCount: getTraverseCount } = hookCounter(
    count => postMessage({ status: "traverse", count }),
    { interval: MIN_MESSAGE_INTERVAL }
  );
  let origin;
  try {
    [, origin] = traverseFileTree(traverseHook, folderPath);
  } catch (err) {
    reportError(err);
    reportMessage("Error in traverseFileTree");
    postMessage({ status: "error", message: err.message });
    return;
  }
  postMessage({ status: "traverse", count: getTraverseCount() });

  let totalMakeCount = getTraverseCount();
  postMessage({ status: "make", count: 0, totalCount: totalMakeCount });

  const { hook: makeHook, getCount: getMakeCount } = hookCounter(
    count => postMessage({ status: "make", count, totalCount: totalMakeCount }),
    { interval: MIN_MESSAGE_INTERVAL }
  );
  let vfs;
  try {
    vfs = VirtualFileSystem.make(origin, folderPath, makeHook);
    postMessage({
      status: "make",
      count: getMakeCount(),
      totalCount: totalMakeCount
    });
  } catch (err) {
    reportError(err);
    reportMessage("Error in vfs.make");
    postMessage({ status: "error", message: err.message });
    return;
  }
  const derivateTotalCount = vfs.get("files_and_folders").count();
  postMessage({
    status: "derivateFF",
    count: 0,
    totalCount: derivateTotalCount
  });

  const derivateThrottledHook = (count, type) => {
    if (type === "reducedFilesAndFolders") {
      postMessage({
        status: "derivateFF",
        count,
        totalCount: derivateTotalCount
      });
    } else if (type === "divedFilesAndFolders") {
      postMessage({
        status: "divedFF",
        count: count - derivateTotalCount,
        totalCount: derivateTotalCount
      });
    }
  };

  const { hook: derivateHook, getCount: getDerivateCount } = hookCounter(
    derivateThrottledHook,
    { interval: MIN_MESSAGE_INTERVAL }
  );
  try {
    vfs = VirtualFileSystem.derivate(vfs, derivateHook);
    postMessage({
      status: "divedFF",
      count: getDerivateCount() / 2,
      totalCount: derivateTotalCount
    });
  } catch (err) {
    reportError(err);
    reportMessage("Error in vfs.derivate");
    postMessage({ status: "error", message: err.message });
  }
  postMessage({
    status: "return",
    vfs: VirtualFileSystem.toJs(vfs)
  });
}

onmessage = function(e) {
  const data = e.data;
  const dropped_folder_path = data.dropped_folder_path;

  if (isJsonFile(dropped_folder_path)) {
    loadJsonConfig(dropped_folder_path);
  } else {
    loadFolder(dropped_folder_path);
  }
};
