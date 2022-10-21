import {
  IS_DIST_MODE,
  IS_E2E,
  IS_PACKAGED,
  RESOURCES_PATH,
} from "@common/config";
import { loadApp } from "@common/modules/app";
import {
  isQuitingForUpdate,
  setupAutoUpdate,
} from "@common/modules/auto-update";
import { loadHash } from "@common/modules/hash";
import {
  get as getConfig,
  initNewUserConfig,
  set as setConfig,
} from "@common/modules/new-user-config";
import { getTrackerProvider, initTracking } from "@common/modules/tracker";
import { loadWindow } from "@common/modules/window";
import { setupSentry } from "@common/monitoring/sentry";
import { sleep } from "@common/utils/os";
import { version } from "@common/utils/package";
import type { Extension } from "electron";
import { app, BrowserWindow, dialog, ipcMain, Menu, session } from "electron";
import { totalmem } from "os";
import path from "path";

module.hot?.accept();

// Initializes sentry logging for production build
const sentryCallback = setupSentry();

// We need to check if we are on 64 bits.
// Setting --max-old-space-size with this value
// make chromium crash on 32 bits.
if (process.arch === "x64") {
  app.commandLine.appendSwitch("js-flags", "--max-old-space-size=40960");
}

if (app.isPackaged) {
  Menu.setApplicationMenu(null);
} else {
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
    if (isQuitingForUpdate()) {
      return;
    }
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
      title = "Bye bye!";
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

const INDEX_URL = IS_PACKAGED()
  ? `file://${path.join(__dirname, "index.html")}`
  : IS_E2E || IS_DIST_MODE
  ? `file://${path.join(__dirname, "/../renderer/index.html")}`
  : `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`;

const PRELOAD_PATH = path.resolve(RESOURCES_PATH, "preload.js");

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: false,
      defaultEncoding: "UTF-8",
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: PRELOAD_PATH,
    },
  });

  win.once("ready-to-show", () => {
    win?.show();
  });

  loadWindow(win);
  win.maximize();

  await win.loadURL(INDEX_URL);

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
  if (!IS_E2E && !IS_PACKAGED()) {
    let devToolsLoaded = Promise.resolve<Extension | null>(null);
    try {
      devToolsLoaded = session.defaultSession
        .loadExtension(
          path.join(process.cwd(), "scripts", "out", "react-devtools-extension")
        )
        .catch((err) => {
          console.error("Cannot load react dev tools.", err);
          return null;
        });
    } catch (err: unknown) {
      console.error("Error loading React dev tools", err);
    }

    void devToolsLoaded.then(() => win?.webContents.openDevTools());
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  // -- init all "modules"
  // TODO: do real modules
  await initNewUserConfig();
  await initTracking();
  loadHash();
  loadApp();
  setupAutoUpdate();

  // post init
  const tracker = getTrackerProvider();
  sentryCallback(getConfig("appId"), ...tracker.getSentryIntegations());
  const firstOpened = getConfig("_firstOpened");
  if (firstOpened) {
    tracker.track("App First Opened", {
      arch: process.arch,
      date: new Date(),
      os: process.platform,
      ram: totalmem() / 1024 / 1024 / 1024,
      version,
    });
    setConfig("_firstOpened", false);
  }

  tracker.track("App Opened", {
    date: new Date(),
    version,
  });

  // finally create window
  await createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    await createWindow();
  }
});

app.on("will-quit", async (event) => {
  event.preventDefault();
  getTrackerProvider().track("App Closed", { date: new Date() });
  await sleep(1000);
  process.exit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Needed for secret devtools
ipcMain.on("open-devtools", () => {
  win?.webContents.openDevTools();
});
