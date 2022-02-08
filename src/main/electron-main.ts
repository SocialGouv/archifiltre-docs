/* eslint-disable import/no-named-as-default-member */
import type { Extension } from "electron";
import {
  app,
  BrowserWindow,
  crashReporter,
  dialog,
  ipcMain,
  Menu,
  session,
} from "electron";
import path from "path";
import Raven from "raven"; // TODO: switch to @sentry/node (https://docs.sentry.io/platforms/node/)

import { loadApp } from "./app";
import { loadHash } from "./hash";
import { loadWindow } from "./window";

// Initializes sentry logging for production build
if (app.isPackaged) {
  // Initialize sentry error reporter
  Raven.config(SENTRY_DSN).install();

  // Enable electron crash reporter to get logs in case of low level crash
  crashReporter.start({
    companyName: "SocialGouv",
    ignoreSystemCrashHandler: true,
    productName: "Docs par Archifiltre",
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
let win: BrowserWindow | null = null;

const getLanguage = () => app.getLocale().slice(0, 2);

const preventNavigation = () => {
  if (!win) return;
  win.webContents.on("will-navigate", (event) => {
    event.preventDefault();
  });
};

const askBeforeLeaving = () => {
  if (!win) return;
  win.on("close", (event) => {
    event.preventDefault();
    const language = getLanguage();
    let title = "";
    let message = "";
    let detail = "";
    let no = "";
    let yes = "";
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
      detail = "All data that has not been saved will be permanently lost!";
      no = "No";
      yes = "Yes";
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
    const promiseResponse = dialog.showMessageBox(win!, options);
    void promiseResponse.then((obj) => {
      if (obj.response === 1) {
        win?.destroy();
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
      contextIsolation: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: app.isPackaged,
    },
    width: 1500,
  });

  // and load the index.html of the app.
  if (process.env.DEV_SERVER !== "true" && process.env.NODE_ENV !== "test") {
    void win.loadFile(path.join(__dirname, "./index.html"));
  } else {
    void win.loadURL("http://localhost:8000");
  }

  preventNavigation();

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

void app.whenReady().then(() => {
  let devToolsLoaded = Promise.resolve<Extension | null>(null);
  if (REACT_DEV_TOOLS_PATH !== "") {
    try {
      devToolsLoaded = session.defaultSession
        .loadExtension(REACT_DEV_TOOLS_PATH)
        .catch((err) => {
          console.error("Cannot load react dev tools.", err);
          return null;
        });
    } catch (err: unknown) {
      console.error("Error loading React dev tools", err);
    }
  }

  if (!app.isPackaged && process.env.NODE_ENV !== "test") {
    void devToolsLoaded.then(() => win?.webContents.openDevTools());
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
  loadHash();
  loadApp();
  if (win) {
    loadWindow(win);
  }
});

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
  Raven.captureException(new Error("Renderer process crashed"));
});

process.on("uncaughtException", () => {
  Raven.captureException(new Error("Uncaught exception"));
});
// Needed for secret devtools
ipcMain.on("open-devtools", () => {
  win?.webContents.openDevTools();
});
