import type { ElectronApplication, Locator, Page } from "@playwright/test";
import { _electron as electron } from "@playwright/test";
import path from "path";

let electronApp: ElectronApplication, win: Page;
/**
 * Starts the electron application
 */
export const startApp = async (
  autoLoadPath = ""
): Promise<[app: ElectronApplication, win: Page]> => {
  const main = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "dist",
    "main",
    "main.js"
  );

  // possible additional args depending of the context
  // "--disable_splash_screen",
  // "--disable-extensions",
  // "--disable-dev-shm-usage",
  // "--no-sandbox",
  // "--disable-gpu",
  // "--headless",
  // "--disable-software-rasterizer",
  // "--disable-setuid-sandbox",
  electronApp = await electron.launch({
    args: [main],
    env: {
      AUTOLOAD: autoLoadPath,
      DISPLAY: ":0", //TODO: input as env var
      E2E: "true",
      FORCE_TRACKING: "false",
      NODE_ENV: "test-e2e",
    },
    timeout: 120000,
  });

  await electronApp.evaluate(({ app }) => {
    return app.getAppPath();
  });

  win = await electronApp.firstWindow();
  // eslint-disable-next-line no-console
  win.on("console", console.log);
  await win.waitForLoadState();
  return [electronApp, win];
};

export const closeApp = async (app = electronApp): Promise<void> => {
  await app.close();
};

/**
 * Wait for the given time in ms. (like sleep)
 */
export const wait = async (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));

/**
 * Types the text as keyboard input. Handles unicode characters for non text keys.
 */
export const typeText = async (text: string, w = win): Promise<void> => {
  const letters = text.split("");
  for (const letter of letters) {
    await w.keyboard.type(letter);
  }
};

/**
 * Clicks over the element locator
 */
export const clickOverElement = async (
  locator: Locator,
  w = win
): Promise<void> => {
  const box = await locator.boundingBox();
  if (!box) {
    return;
  }
  const { x, y } = box;
  await w.mouse.click(x, y);
};
