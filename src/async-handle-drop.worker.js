import { traverseFileTree, isJsonFile, readFileSync } from "util/file-sys-util";

import * as VirtualFileSystem from "datastore/virtual-file-system";
import { fromAnyJsonToJs } from "compatibility";

import version from "version";
import { reportError, reportMessage } from './reporter';

/**
 * Loads a preexisting saved config
 * @param dropped_folder_path
 */
function loadJsonConfig(dropped_folder_path) {
  const content = readFileSync(dropped_folder_path, "utf8");
  const content_without_byte_order_mark = content.slice(1);

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
  const THRESH = 1000;
  let count = 0;
  let last_ms = 0;

  const traverseHook = () => {
    count++;
    let cur_ms = new Date().getTime();

    if (cur_ms - last_ms >= THRESH) {
      postMessage({ status: "traverse", count });
      last_ms = cur_ms;
    }
  };

  postMessage({ status: "traverse", count });
  let path;
  let origin;

  try {
    [path, origin] = traverseFileTree(traverseHook, folderPath);
  } catch (err) {
    reportError(err);
    reportMessage('Error in traverseFileTree');
    postMessage({ status: "error", message: err.message });
    return;
  }
  postMessage({ status: "traverse", count });

  postMessage({ status: "make" });
  let vfs;
  try {
    vfs = VirtualFileSystem.make(origin, folderPath);
  } catch (err) {
    reportError(err);
    reportMessage('Error in vfs.make');
    postMessage({ status: "error", message: err.message });
    return;
  }
  postMessage({ status: "derivate" });
  try {
    vfs = VirtualFileSystem.derivate(vfs);
  } catch (err) {
    reportError(err);
    reportMessage('Error in vfs.derivate');
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
