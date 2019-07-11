const { app, BrowserWindow } = require("electron");

const { dialog } = require("electron");

const path = require("path");

app.commandLine.appendSwitch("js-flags", "--max-old-space-size=40960");

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
      message = "Êtes-vous sure de vouloir quitter ?";
      detail =
        "Toutes les données qui n'ont pas étaient sauvegardées seront perdu définitivement !";
      no = "non";
      yes = "oui";
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
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
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

const { ipcMain } = require("electron");
// Needed for secret devtools
ipcMain.on("open-devtools", (event, arg) => {
  win.webContents.openDevTools();
});
