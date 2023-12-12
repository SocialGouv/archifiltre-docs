import type { UnknownMapping } from "@common/utils/type";
import { LEVEL, MESSAGE } from "triple-beam";
import TransportStream from "winston-transport";

interface InfoObject {
  [LEVEL]: UnknownMapping | ("error" | "warning");
  [MESSAGE]: string;
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
      console.info(message);
    }

    if (callback) {
      callback();
    }
  }
}
