import "@sentry/electron/preload";

import sourceMapSupport from "source-map-support";

sourceMapSupport.install();

module.hot?.accept();

console.info("[Preload] Inited");
