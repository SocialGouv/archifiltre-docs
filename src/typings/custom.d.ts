declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare const STATIC_ASSETS_PATH: string;
declare const SENTRY_DSN: string;
declare const SENTRY_MINIDUMP_URL: string;
declare const ARCHIFILTRE_SITE_URL: string;
declare const WRITE_DEBUG: string;
