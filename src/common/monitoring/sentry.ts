import { BrowserClient } from "@sentry/browser";
import type { ElectronOptions } from "@sentry/electron";
import { getCurrentHub, init } from "@sentry/electron";
import { NodeClient } from "@sentry/node";
import type { Integration } from "@sentry/types";

import { IS_MAIN, IS_PACKAGED, PRODUCT_CHANNEL } from "../config";
import type { TrackAppId } from "../tracker/type";
import { name, version } from "../utils/package";

export type SentrySetupCallback = (
  userId: string,
  ...additionalIntegrations: Integration[]
) => void;

/**
 * Setup Sentry in main or renderer and return a "post setup"
 * callback to be used after tracking is loaded for example.
 *
 * The first setup should be set at the top most of the process.
 *
 * @returns "Post setup" callback
 */
export const setupSentry = (): SentrySetupCallback => {
  if (!IS_PACKAGED()) return () => void 0;
  const commonOptions: Partial<ElectronOptions> = {
    dsn: process.env.SENTRY_DSN,
    environment: PRODUCT_CHANNEL === "stable" ? "production" : PRODUCT_CHANNEL,
    // because we do a manual preload
    getSessions: () => [],
    release: `${name}@${version}`,
  };
  init(commonOptions);

  return (userId: TrackAppId, ...additionalIntegrations: Integration[]) => {
    const Client = IS_MAIN ? NodeClient : BrowserClient;
    getCurrentHub().bindClient(
      new Client({
        ...commonOptions,
        initialScope: (scope) => {
          scope.setUser({
            id: userId,
          });
          return scope;
        },
        integrations: (integrations: Integration[]) => [
          ...integrations,
          ...additionalIntegrations,
        ],
      })
    );
  };
};
