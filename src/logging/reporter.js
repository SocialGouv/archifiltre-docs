import * as Sentry from "@sentry/browser";
import { createLogger } from "winston";
import WinstonSentry from "winston-sentry-raven-transport";
import WinstonConsoleLogger from "./winston-console-logger";

const sentryUrl = SENTRY_DSN;

const isProd = () => MODE === "production";

const Level = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  HTTP: "http",
  VERBOSE: "verbose",
  DEBUG: "debug",
  SILLY: "silly"
};

const logger = createLogger({
  transports: [
    new WinstonConsoleLogger({
      level: Level.SILLY
    })
  ]
});

if (isProd()) {
  Sentry.init({
    dsn: sentryUrl
  });

  logger.add(
    new WinstonSentry({
      dsn: sentryUrl,
      level: Level.WARN
    })
  );
}

/**
 * Reports an error to the log server.
 * @param err
 */
export const reportError = err => {
  logger.error(err);
};

/**
 * Sends a message to the log server.
 * @param message
 */
export const reportWarning = message => {
  logger.warn(message);
};
