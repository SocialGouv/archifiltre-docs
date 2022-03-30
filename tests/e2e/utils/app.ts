import type { Locator, Page } from "@playwright/test";

import { clickOverElement, typeText } from "./test";

/**
 * Opens the export menu
 */
export const openExportMenu = async (win: Page): Promise<void> => {
  await clickOverElement(win, getLocatorByTestId(win, "export-menu"));
};

/**
 * Returns a promise that resolves when the notification appears
 */
export const waitForSuccessNotification = async (
  win: Page,
  notificationText: string
): Promise<void> => {
  await win.waitForSelector(
    `.notification-success .message >> text=${notificationText}`
  );
};

/**
 * Clicks an icicle element based on the related file path
 */
export const clickIcicleElement = async (
  win: Page,
  filePath: string
): Promise<void> => {
  await clickOverElement(win, getLocatorByTestId(win, filePath));
};

/**
 * Generates the selector for the specified testId
 */
const makeTestIdSelector = (testId: string) => `[data-test-id="${testId}"]`;

/**
 * Selects an element by its testId
 */
export const getLocatorByTestId = (win: Page, testId: string): Locator =>
  win.locator(makeTestIdSelector(testId));

/**
 * Start editing tag box
 */
const enableTagEdition = async (win: Page) => {
  await getLocatorByTestId(win, "tag-edit-box").click();
};

/**
 * Start editing tag box
 */
const enableDescriptionEdition = async (win: Page) => {
  await getLocatorByTestId(win, "description-edit-box").click();
};

/**
 * Add tags to the currently selected element
 */
export const addTags = async (win: Page, tags: string[]): Promise<void> => {
  await enableTagEdition(win);

  const keyboardInputs = `${tags.join("\n")}\n`;
  await typeText(win, keyboardInputs);
};

/**
 * Add description to the currently selected element
 */
export const addDescription = async (
  win: Page,
  description: string
): Promise<void> => {
  await enableDescriptionEdition(win);

  await typeText(win, description);
  // We click outside the box to save our description
  await win.mouse.click(10, 10);
};

/**
 * Triggers the RESIP export
 */
export const exportToResip = async (win: Page): Promise<void> => {
  await openExportMenu(win);
  await getLocatorByTestId(win, "resip-button").click();
};
