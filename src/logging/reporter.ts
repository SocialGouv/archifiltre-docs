import type { Event as SentryEvent } from "@sentry/browser";
import * as Sentry from "@sentry/browser";
import dateFormat from "dateformat";
import { merge } from "lodash";
import path from "path";
import { createLogger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import type { SentryTransportOptions } from "winston-transport-sentry-node";
import WinstonSentry from "winston-transport-sentry-node";

import { getPath } from "../util/electron/electron-util";
import WinstonConsoleLogger from "./winston-console-logger";

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

    const sentryOptions: SentryTransportOptions["sentry"] = {
        beforeSend(event) {
            return anonymizeEvent(event);
        },
        dsn: SENTRY_DSN,
    };

    Sentry.init(sentryOptions);
    logger.add(
        new WinstonSentry({
            level: Level.WARN,
            sentry: sentryOptions,
        })
    );

    const logsDirectory = path.join(getPath("userData"));

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
export const reportError = (err: unknown) => {
    handleLog(err, Level.ERROR);
};

/**
 * Reports a warning
 * @param message
 */
export const reportWarning = (message: string) => {
    handleLog(message, Level.WARN);
};

/**
 * Reports an info
 * @param message
 */
export const reportInfo = (message: string) => {
    handleLog(message, Level.INFO);
};

/**
 * Anonymizes the event of Archifiltre to send an obfuscated string to Matomo
 * @param event
 */
const anonymizeEvent = (event: SentryEvent) => {
    const values = event.exception?.values?.map((value) => {
        const frames = value.stacktrace?.frames?.map((frame) => {
            const filename = path.basename(frame.filename || "");
            return merge(frame, { filename });
        });
        return merge(value, { stacktrace: { frames } });
    });
    return merge(event, { exception: { values } });
};
