import type { ElectronApplication, Locator, Page } from "@playwright/test";
import { _electron as electron } from "@playwright/test";
import path from "path";

/**
 * Starts the electron application
 */
export const startApp = async (): Promise<ElectronApplication> => {
  const main = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "dist",
    "main",
    "main.js"
  );
  const electronApp = await electron.launch({
    args: [
      // "--disable_splash_screen",
      // "--disable-extensions",
      // "--disable-dev-shm-usage",
      // "--no-sandbox",
      // "--disable-gpu",
      // "--headless",
      // "--disable-software-rasterizer",
      // "--disable-setuid-sandbox",
      main,
    ],
    env: {
      AUTOLOAD: path.resolve(__dirname, "../../test-folder/"),
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

  const win = await electronApp.firstWindow();
  // eslint-disable-next-line no-console
  win.on("console", console.log);
  await win.waitForLoadState();
  return electronApp;
};

export const wait = async (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));

/**
 * Types the text as keyboard input. Handles unicode characters for non text keys.
 */
export const typeText = async (win: Page, text: string): Promise<void> => {
  const letters = text.split("");
  for (const letter of letters) {
    await win.keyboard.type(letter);
  }
};

/**
 * Clicks over the element locator
 */
export const clickOverElement = async (
  win: Page,
  locator: Locator
): Promise<void> => {
  const box = await locator.boundingBox();
  if (!box) {
    return;
  }
  const { x, y } = box;
  await win.mouse.click(x, y);
};
