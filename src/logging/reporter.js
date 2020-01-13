import * as Sentry from "@sentry/browser";

const sentryUrl = SENTRY_DSN;

const isProd = () => MODE === "production";

if (isProd()) {
  Sentry.init({
    dsn: sentryUrl
  });
}

/**
 * Reports an error to the log server.
 * @param err
 */
export const reportError = err => {
  if (isProd()) {
    Sentry.captureException(err);
  } else {
    console.error(err);
  }
};

/**
 * Sends a message to the log server.
 * @param message
 */
export const reportMessage = message => {
  if (isProd()) {
    Sentry.captureMessage(message);
  } else {
    console.log(message);
  }
};
