import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://0fa8ab6a50a347a3b1903ed48b4c9e5c@sentry.num.social.gouv.fr/20"
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
