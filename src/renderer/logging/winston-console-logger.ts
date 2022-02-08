import type { UnknownMapping } from "@common/utils/types";
import { LEVEL, MESSAGE } from "triple-beam";
import TransportStream from "winston-transport";

interface InfoObject {
  [MESSAGE]: string;
  [LEVEL]: UnknownMapping | ("error" | "warning");
}

/**
 * A simple logger that logs into the console, as winston console logger does not work well with electron.
 */
export class WinstonConsoleLogger extends TransportStream {
  public log(info: InfoObject, callback?: VoidFunction): void {
    const message = info[MESSAGE];
    if (info[LEVEL] === "error") {
      console.error(message);
    } else if (info[LEVEL] === "warning") {
      console.warn(message);
    } else {
      console.log(message);
    }

    if (callback) {
      callback();
    }
  }
}
