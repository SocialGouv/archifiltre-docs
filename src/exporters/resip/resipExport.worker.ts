import {
  MessageTypes,
  WorkerMessage
} from "../../util/batch-process/batch-process-util-types";
import { hookCounter } from "../../util/hook-utils";
import resipExporter from "./resipExporter";

const ctx: Worker = self as any;

// The target origin is "*" as this is a service worker

const sendMessage = (message: WorkerMessage) => {
  ctx.postMessage(message);
};

ctx.onmessage = ({ data: { data, type } }) => {
  if (type === "initialize") {
    const messageHook = count => {
      sendMessage({
        result: { count, resipCsv: [] },
        type: MessageTypes.RESULT
      });
    };
    const { hook, getCount } = hookCounter(messageHook);

    const { filesAndFolders, tags } = data;

    const resipExportData = resipExporter(filesAndFolders, tags, hook);

    sendMessage({
      result: { count: getCount(), resipCsv: resipExportData },
      type: MessageTypes.RESULT
    });

    sendMessage({
      type: MessageTypes.COMPLETE
    });
  }
};
