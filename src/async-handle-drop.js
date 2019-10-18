/* eslint import/default: OFF */
import LoadFromFilesystemWorker from "./load-from-filesystem.worker";
import LoadFromJsonWorker from "./load-from-json.worker";
import { isJsonFile } from "./util/file-sys-util";

export default (hook, droppedElementPath) => {
  return new Promise((resolve, reject) => {
    const worker = isJsonFile(droppedElementPath)
      ? new LoadFromJsonWorker()
      : new LoadFromFilesystemWorker();
    worker.onmessage = event => {
      switch (event.data.status) {
        case "return":
          worker.terminate();
          resolve(event.data.vfs);
          break;
        case "error":
          worker.terminate();
          reject(event.data.message);
          break;
        default:
          hook(event.data);
      }
    };
    worker.postMessage({
      droppedElementPath
    });
  });
};
