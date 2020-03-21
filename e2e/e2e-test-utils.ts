import electron from "electron";
import path from "path";
import { Application } from "spectron";

/**
 * Starts the electron application
 */
export const startApp = async (): Promise<Application> => {
  const electronPath = "" + electron;

  const app = new Application({
    args: [path.join(__dirname, "..")],
    path: path.resolve(__dirname, electronPath),
  });

  return app.start();
};

/**
 * Returns a promise that resolves after time ms
 * @param time - The waiting time
 */
export const wait = (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));

/**
 * Types the text as keyboard input. Handles unicode characters for non text keys.
 * @param app - The spectron app object
 * @param text - The text to type
 */
export const typeText = async (app, text: string): Promise<void> => {
  const letters = text.split("");
  for (const letter of letters) {
    await typeLetter(app, letter);
  }
};

/**
 * Types a letter as keyboard input. Handles unicode characters for non text keys.
 * @param app - The spectron app object
 * @param letter - The letter to type
 */
const typeLetter = async (app, letter: string): Promise<void> => {
  await app.client.actions([
    {
      actions: [
        { type: "keyDown", value: letter },
        { type: "keyUp", value: letter },
      ],
      id: "typeLetter",
      type: "key",
    },
  ]);
};

/**
 * Clicks over the element
 * @param app - The spectron app object
 * @param element - The element to click over.
 * @example
 * clickOverElement(app, app.client.$(".element-class"))
 */
export const clickOverElement = async (app, element): Promise<void> => {
  const { x, y } = await element.getLocation();

  await clickOnPosition(app, parseInt(x, 10), parseInt(y, 10));
};

/**
 * Clicks on a screen position
 * @param app - The spectron app object
 * @param x - the x position. Must be an integer.
 * @param y - the y position. Must be an integer.
 */
export const clickOnPosition = async (
  app,
  x: number,
  y: number
): Promise<void> => {
  await app.client.actions([
    {
      actions: [
        {
          duration: 0,
          type: "pointerMove",
          x,
          y,
        },
        { type: "pointerDown", button: 0 },
        { type: "pointerUp", button: 0 },
      ],
      id: "click-on-icicle-1",
      type: "pointer",
    },
  ]);
};
