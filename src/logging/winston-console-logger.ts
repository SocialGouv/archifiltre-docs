import { LEVEL, MESSAGE } from "triple-beam";
import TransportStream from "winston-transport";

/**
 * A simple logger that logs into the console, as winston console logger does not work well with electron.
 */
export default class WinstonConsoleLogger extends TransportStream {
  constructor(options?: TransportStream.TransportStreamOptions) {
    super(options);
  }

  public log(info: object, callback: () => void) {
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
