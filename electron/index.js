const Raven = require("raven");

const { app, BrowserWindow, crashReporter, Menu } = require("electron");

const { dialog } = require("electron");

const path = require("path");

const sentryUrl =
  "https://0fa8ab6a50a347a3b1903ed48b4c9e5c@sentry.tools.factory.social.gouv.fr/20";
const sentryMinidumpUrl =
  "https://sentry.tools.factory.social.gouv.fr/api/20/minidump/?sentry_key=0fa8ab6a50a347a3b1903ed48b4c9e5c";

// Initializes sentry logging for production build
if (app.isPackaged) {
  // Initialize sentry error reporter
  Raven.config(sentryUrl).install();

  // Enable electron crash reporter to get logs in case of low level crash
  crashReporter.start({
    companyName: "SocialGouv",
    productName: "Archifiltre",
    ignoreSystemCrashHandler: true,
    submitURL: sentryMinidumpUrl
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

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

const getLanguage = () => app.getLocale().slice(0, 2);

const preventNavigation = () => {
  win.on("will-navigate", event => {
    event.preventDefault();
  });

  win.webContents.on("will-navigate", event => {
    event.preventDefault();
  });
};

const askBeforeLeaving = () => {
  win.on("close", event => {
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
    const option = {
      type: "warning",
      buttons: [no, yes],
      defaultId: 0,
      title,
      message,
      detail,
      cancelId: 0
    };
    dialog.showMessageBox(win, option, a => {
      if (a === 1) {
        win.destroy();
      }
    });
  });
};

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1500,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    },
    show: false
  });

  // and load the index.html of the app.
  if (process.env.DEV_SERVER !== "true") {
    win.loadFile(path.join(__dirname, "dist/index.html"));
  } else {
    win.loadURL("http://localhost:8000");
  }

  preventNavigation();

  // Open the DevTools.
  if (!app.isPackaged) {
    win.webContents.openDevTools();
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
  console.log("window-all-closed");
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

app.on("before-quit", () => {
  console.log("before-quit");
});

app.on("will-quit", () => {
  console.log("will-quit");
});

app.on("quit", () => {
  console.log("quit");
});

app.on("will-navigate", () => {
  console.log("will-navigate");
});

app.on("renderer-process-crashed", function(event) {
  Raven.captureException("Renderer process crashed");
});

process.on("uncaughtException", error => {
  Raven.captureException("Uncaught exception");
});

const { ipcMain } = require("electron");
// Needed for secret devtools
ipcMain.on("open-devtools", (event, arg) => {
  win.webContents.openDevTools();
});
