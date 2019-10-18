import { traverseFileTree } from "util/file-sys-util";

import * as VirtualFileSystem from "datastore/virtual-file-system";
import { reportError, reportMessage } from "./reporter";
import { hookCounter } from "./util/hook-utils";

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

  const totalMakeCount = getTraverseCount();
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
  } catch (error) {
    reportError(error);
    reportMessage("Error in vfs.derivate");
    postMessage({ status: "error", message: error.message });
  }
  postMessage({
    status: "return",
    vfs: VirtualFileSystem.toJs(vfs)
  });
}

onmessage = ({ data: { droppedElementPath } }) => {
  loadFolder(droppedElementPath);
};
