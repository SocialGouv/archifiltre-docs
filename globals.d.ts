declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png";

declare module "windows-1252";
declare module "angular-expressions";
declare module "source-map-support";
declare module "fswin" {
  namespace FsWin {
    export interface Attributes {
      readonly IS_HIDDEN: boolean;
    }
  }
  interface FsWin {
    getAttributes: (
      path: string,
      cb: (attributes?: FsWin.Attributes) => void
    ) => void;
    getAttributesSync: (path: string) => FsWin.Attributes;
  }

  const fswin: FsWin;

  export { FsWin };
  export default fswin;
}

declare module "fswin/*.node" {
  import fswin, { FsWin } from "fswin";

  export { FsWin };
  export default fswin;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __static: string;

declare namespace NodeJS {
  interface ProcessEnv {
    ARCHIFILTRE_SITE_URL: string;
    AUTOLOAD: string;
    AUTORELOAD?: "false" | "true";
    CI?: "true";
    FORCE_TRACKING: string;
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
