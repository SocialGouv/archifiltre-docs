import * as Sentry from "@sentry/browser";
import dateFormat from "dateformat";
import electron from "electron";
import path from "path";
import { createLogger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import WinstonSentry from "winston-sentry-raven-transport";
import WinstonConsoleLogger from "./winston-console-logger";

//const isProd = () => MODE === "production";

enum Level {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  HTTP = "http",
  VERBOSE = "verbose",
  DEBUG = "debug",
  SILLY = "silly",
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
export const initReporter = async (isActive: boolean): void => {
  /*if (!isProd() || !isActive) {
    return;
  }*/

  const sentryUrl = SENTRY_DSN;
  Sentry.init({
    dsn: sentryUrl,
    beforeSend(event, hint) {
      console.log("TESTRYETXDFYGIUHOJ");
      console.log(">>>>>>>>", event);
      console.log("========", hint);
      return event;
    },
  });
  logger.add(
    new WinstonSentry({
      dsn: sentryUrl,
      level: Level.WARN,
      config: {
        beforeSend(event) {
          console.log("LOLILOL");
          return event;
        },
      },
    })
  );

  const logsDirectory = path.join(electron.remote.app.getPath("userData"));

  logger.add(
    new DailyRotateFile({
      createSymlink: true,
      dirname: logsDirectory,
      filename: "archifiltre-logs-%DATE%",
      level: Level.INFO,
      maxFiles: "7d",
    })
  );
};

/**
 * Sends a message to the log server.
 * @param message
 * @param level
 */
const handleLog = (message: any, level: Level) => {
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
export const reportError = (err) => {
  handleLog(err, Level.ERROR);
};

/**
 * Reports a warning
 * @param message
 */
export const reportWarning = (message) => {
  handleLog(message, Level.WARN);
};

/**
 * Reports an info
 * @param message
 */
export const reportInfo = (message) => {
  handleLog(message, Level.INFO);
};
