declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png";

declare module "windows-1252";
declare module "angular-expressions";

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __static: string;

declare namespace NodeJS {
  interface ProcessEnv {
    SENTRY_DSN: string;
    SENTRY_ORG: string;
    SENTRY_URL: string;
    TRACKER_FAKE_HREF?: string;
    TRACKER_MATOMO_ID_SITE: string;
    TRACKER_MATOMO_URL: string;
    TRACKER_POSTHOG_API_KEY: string;
    TRACKER_POSTHOG_URL: string;
    TRACKER_PROVIDER: string;
    AUTOLOAD: string;
    AUTORELOAD?: "false" | "true";
    ARCHIFILTRE_SITE_URL: string;
    FORCE_TRACKING: string;
  }
}
