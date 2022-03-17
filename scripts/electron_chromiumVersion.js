/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserView } = require("electron");

app
  .whenReady()
  .then(() => {
    const window = new BrowserView({
      webPreferences: { nativeWindowOpen: true },
    });
    console.log(`>>>>>${window.webContents.userAgent}<<<<<`);
    app.exit();
    process.exit();
  })
  .catch(console.error);
