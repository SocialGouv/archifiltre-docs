import { IS_PACKAGED } from "@common/config";
import { getPath } from "@common/utils/electron";
import dateFormat from "dateformat";
import path from "path";
import { createLogger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import { WinstonConsoleLogger } from "./winston-console-logger";

//TODO: replace with electron-log

enum Level {
  DEBUG = "debug",
  ERROR = "error",
  HTTP = "http",
  INFO = "info",
  SILLY = "silly",
  VERBOSE = "verbose",
  WARN = "warn",
}

const logger = createLogger({
  transports: [
    new WinstonConsoleLogger({
      level: Level.SILLY,
    }),
  ],
});

/**
 * Inits the reporter here Sentry
 */
export const initReporter = (isActive: boolean): void => {
  if (!IS_PACKAGED() || !isActive) {
    return;
  }

  const logsDirectory = path.join(getPath("userData"));

  logger.add(
    new DailyRotateFile({
      createSymlink: true,
      dirname: logsDirectory,
      filename: "archifiltre-logs-%DATE%",
      level: Level.INFO,
      maxFiles: "7d",
    }),
  );
};

/**
 * Sends a message to the log server.
 * @param message
 * @param level
 */
const handleLog = (message: unknown, level: Level) => {
  const logData = {
    message,
    time: dateFormat("isoDateTime"),
  };

  logger[level](logData);
};

/**
 * Reports an error to the log server.
 * @param err
 */
export const reportError = (err: unknown): void => {
  handleLog(err, Level.ERROR);
};

/**
 * Reports a warning
 * @param message
 */
export const reportWarning = (message: string): void => {
  handleLog(message, Level.WARN);
};

/**
 * Reports an info
 * @param message
 */
export const reportInfo = (message: string): void => {
  handleLog(message, Level.INFO);
};
