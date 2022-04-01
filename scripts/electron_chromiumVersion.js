const { app, BrowserView } = require("electron");

app
  .whenReady()
  .then(() => {
    const window = new BrowserView({
      webPreferences: { nativeWindowOpen: true },
    });
    // used by as parse token in getReactDevtools.ts
    console.log(`>>>>>${window.webContents.userAgent}<<<<<`);
    app.exit();
    process.exit();
  })
  .catch(console.error);
