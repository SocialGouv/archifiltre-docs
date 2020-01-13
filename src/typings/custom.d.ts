declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}

declare const STATIC_ASSETS_PATH: string;
declare const SENTRY_DSN: string;
declare const SENTRY_MINIDUMP_URL: string;
