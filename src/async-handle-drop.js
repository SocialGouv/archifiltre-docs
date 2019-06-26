import AsyncHandleDropWorker from "async-handle-drop.worker";
import * as VirtualFileSystem from "datastore/virtual-file-system";

export default (hook, dropped_folder_path) => {
  return new Promise((resolve, reject) => {
    const worker = new AsyncHandleDropWorker();
    worker.onmessage = e => {
      switch (e.data.status) {
        case "return":
          worker.terminate();
          resolve(VirtualFileSystem.fromJs(e.data.vfs));
          break;
        case "error":
          worker.terminate();
          reject(e.data.message);
          break;
        default:
          hook(e.data);
      }
    };
    worker.postMessage({
      dropped_folder_path
    });
  });
};
