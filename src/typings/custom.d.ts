declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png";

declare const STATIC_ASSETS_PATH: string;
declare const SENTRY_DSN: string;
declare const SENTRY_MINIDUMP_URL: string;
declare const ARCHIFILTRE_SITE_URL: string;
declare const WRITE_DEBUG: string;
declare const WORKER_ROOT_FOLDER: string;
