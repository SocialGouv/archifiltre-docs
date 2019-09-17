import { computeFolderHashes } from "../util/file-and-folders-utils";

onmessage = ({ data: { data, type } }) => {
  if (type === "initialize") {
    try {
      // We batch the results to avoid overloading the main process
      const BATCH_SIZE = 50;
      let batchResult = {};
      const computeFolderHashHook = hashObject => {
        batchResult = { ...batchResult, ...hashObject };

        if (Object.keys(batchResult).length === BATCH_SIZE) {
          postMessage({ type: "result", result: batchResult });
          batchResult = {};
        }
      };

      computeFolderHashes(data.files_and_folders, computeFolderHashHook);

      // flushing remaining results
      postMessage({ type: "result", result: batchResult });
    } catch (error) {
      postMessage({ type: "error", error });
    }

    postMessage({ type: "complete" });
    return;
  }

  postMessage({ type: "unknown" });
};
