declare module "*.svg" {
    const content: string;
    export default content;
}

declare module "*.png";

declare module "react-notifications"; // TODO: use another lib

declare const STATIC_ASSETS_PATH: string;
declare const SENTRY_DSN: string;
declare const SENTRY_MINIDUMP_URL: string;
declare const ARCHIFILTRE_SITE_URL: string;
declare const WRITE_DEBUG: string;
declare const WORKER_ROOT_FOLDER: string;
declare const REACT_DEV_TOOLS_PATH: string;
declare const ARCHIFILTE_VERSION: string;
