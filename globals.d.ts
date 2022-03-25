declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png";

declare module "react-notifications"; // TODO: use another lib
declare module "windows-1252";
declare module "angular-expressions";

declare const STATIC_ASSETS_PATH: string;
declare const SENTRY_DSN: string;
declare const SENTRY_MINIDUMP_URL: string;
declare const ARCHIFILTRE_SITE_URL: string;
declare const WRITE_DEBUG: string;
declare const REACT_DEV_TOOLS_PATH: string;
declare const ARCHIFILTRE_VERSION: string;

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
  }
}
