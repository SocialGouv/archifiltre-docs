const Raven = require("raven");

require("@electron/remote/main").initialize();

const {
  BrowserWindow,
  app,
  crashReporter,
  Menu,
  session,
  dialog,
} = require("electron");

const path = require("path");

// Initializes sentry logging for production build
if (app.isPackaged) {
  // Initialize sentry error reporter
  Raven.config(SENTRY_DSN).install();

  // Enable electron crash reporter to get logs in case of low level crash
  crashReporter.start({
    companyName: "SocialGouv",
    ignoreSystemCrashHandler: true,
    productName: "Archifiltre",
    submitURL: SENTRY_MINIDUMP_URL,
  });
}

// We need to check if we are on 64 bits.
// Setting --max-old-space-size with this value
// make chromium crash on 32 bits.
if (process.arch === "x64") {
  app.commandLine.appendSwitch("js-flags", "--max-old-space-size=40960");
}

// Passing null will suppress the default menu.
// On Windows and Linux, this has the additional
// effect of removing the menu bar from the window.
if (app.isPackaged) {
  Menu.setApplicationMenu(null);
}

if (!app.isPackaged) {
  app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

const getLanguage = () => app.getLocale().slice(0, 2);

const preventNavigation = () => {
  win.on("will-navigate", (event) => {
    event.preventDefault();
  });

  win.webContents.on("will-navigate", (event) => {
    event.preventDefault();
  });
};

const askBeforeLeaving = () => {
  win.on("close", (event) => {
    event.preventDefault();
    const language = getLanguage();
    let title;
    let message;
    let detail;
    let no;
    let yes;
    if (language === "fr") {
      title = "Bye bye !";
      message = "Êtes-vous sûr•e de vouloir quitter ?";
      detail =
        "Toutes les données qui n'ont pas été sauvegardées seront perdues définitivement !";
      no = "Non";
      yes = "Oui";
    } else {
      title = "Bye bye !";
      message = "Are you sure you want to leave?";
      detail = "All data that has not been saved will be permanently lost !";
      no = "no";
      yes = "yes";
    }
    const options = {
      buttons: [no, yes],
      cancelId: 0,
      defaultId: 0,
      detail: detail,
      message: message,
      title: title,
      type: "warning",
    };
    const promiseResponse = dialog.showMessageBox(win, options);
    promiseResponse.then((obj) => {
      if (obj.response === 1) {
        win.destroy();
      }
    });
  });
};

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    height: 800,
    show: !app.isPackaged,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: app.isPackaged,
    },
    width: 1500,
  });

  // and load the index.html of the app.
  if (process.env.DEV_SERVER !== "true" && process.env.NODE_ENV !== "test") {
    win.loadFile(path.join(__dirname, "./index.html"));
  } else {
    win.loadURL("http://localhost:8000");
  }

  let devToolsLoaded = Promise.resolve();
  if (REACT_DEV_TOOLS_PATH !== "") {
    try {
      devToolsLoaded = session.defaultSession
        .loadExtension(REACT_DEV_TOOLS_PATH)
        .catch((err) => {
          console.error("Cannot load react dev tools.", err);
        });
    } catch (err) {
      console.error("Error loading React dev tools", err);
    }
  }

  preventNavigation();

  console.log(app.isPackaged, process.env.NODE_ENV);
  // Open the DevTools.
  if (!app.isPackaged && process.env.NODE_ENV !== "test") {
    devToolsLoaded.then(() => win.webContents.openDevTools());
  }

  if (app.isPackaged) {
    askBeforeLeaving();
  }
  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on("renderer-process-crashed", () => {
  Raven.captureException("Renderer process crashed");
});

process.on("uncaughtException", () => {
  Raven.captureException("Uncaught exception");
});

const { ipcMain } = require("electron");
// Needed for secret devtools
ipcMain.on("open-devtools", () => {
  win.webContents.openDevTools();
});
