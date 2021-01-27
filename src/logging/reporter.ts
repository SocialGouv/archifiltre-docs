import * as Sentry from "@sentry/browser";
import dateFormat from "dateformat";
import electron from "electron";
import path from "path";
import { createLogger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import WinstonSentry from "winston-transport-sentry-node";
import WinstonConsoleLogger from "./winston-console-logger";
import { Event as SentryEvent } from "@sentry/browser";
import { merge } from "lodash";

const isProd = () => MODE === "production";

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
export const initReporter = (isActive: boolean): void => {
  if (!isProd() || !isActive) {
    return;
  }

  const sentryOptions = {
    dsn: SENTRY_DSN,
    beforeSend(event) {
      return anonymizeEvent(event);
    },
  };

  Sentry.init(sentryOptions);
  logger.add(
    new WinstonSentry({
      sentry: sentryOptions,
      level: Level.WARN,
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

/**
 * Anonymizes the event of Archifiltre to send an obfuscated string to Matomo
 * @param event
 */
const anonymizeEvent = (event: SentryEvent) => {
  const values = event?.exception?.values?.map((value) => {
    const frames = value?.stacktrace?.frames?.map((frame) => {
      const filename = path.basename(frame?.filename || "");
      return merge(frame, { filename });
    });
    return merge(value, { stacktrace: { frames } });
  });
  return merge(event, { exception: { values } });
};
