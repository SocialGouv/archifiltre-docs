import path from "path";
import { computeHash } from "../util/hash-util";

postMessage({ type: "running" });

let basePath;

onmessage = ({ data: { data, type } }) => {
  switch (type) {
    case "initialize":
      ({ basePath } = data);
      break;

    case "data":
      try {
        const result = data.map(param => ({
          param,
          result: computeHash(path.join(basePath, param))
        }));
        postMessage({ type: "result", result });
      } catch (err) {
        postMessage({ type: "error", err });
      }
      break;

    default:
      postMessage({ type: "unknown" });
  }
};
