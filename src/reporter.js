import * as Sentry from "@sentry/browser";

const sentryUrl =
  "https://0fa8ab6a50a347a3b1903ed48b4c9e5c@sentry.tools.factory.social.gouv.fr/20";

Sentry.init({
  dsn: sentryUrl
});

/**
 * Reports an error to the log server.
 * @param err
 */
export const reportError = err => {
  Sentry.captureException(err);
};

/**
 * Sends a message to the log server.
 * @param message
 */
export const reportMessage = message => {
  Sentry.captureMessage(message);
};
