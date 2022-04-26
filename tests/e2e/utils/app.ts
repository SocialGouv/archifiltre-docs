import type { Locator, Page } from "@playwright/test";

import { clickOverElement, typeText } from "./test";

/**
 * Opens the export menu
 */
export const openExportMenu = async (win: Page): Promise<void> => {
  await getLocatorByTestId(win, "export-menu").click();
};

/**
 * Returns a promise that resolves when the notification appears
 */
export const waitForSuccessNotification = async (
  win: Page,
  notificationText: string
): Promise<void> => {
  await win.waitForSelector(
    `.notification-success >> text=${notificationText}`
  );
};

/**
 * Clicks an icicle element based on the related file path
 */
export const clickOverIcicleElement = async (
  win: Page,
  filePath: string
): Promise<void> => {
  await clickOverElement(getIcicleLocatorByTestId(win, filePath), win);
};

export const clickIcicleElement = async (
  win: Page,
  filePath: string
): Promise<void> => {
  await getIcicleLocatorByTestId(win, filePath).click({ force: true });
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
export const getIcicleLocatorByTestId = (win: Page, testId: string): Locator =>
  win.locator(`[data-test-id="main-icicle"] ${makeTestIdSelector(testId)}`);

/**
 * Start editing tag box
 */
const enableTagEdition = async (win: Page) => {
  await getLocatorByTestId(win, "tab-enrichment").click();
  await getLocatorByTestId(win, "tag-edit-box").click();
};

/**
 * Start editing tag box
 */
const enableDescriptionEdition = async (win: Page) => {
  await getLocatorByTestId(win, "comment-edit-box").click();
};

/**
 * Add tag to the currently selected element
 */
export const addTag = async (win: Page, tag: string): Promise<void> => {
  await enableTagEdition(win);
  await typeText(tag, win);
  // We click outside the box to save our description
  await win.keyboard.press("Enter", { delay: 100 });
};

/**
 * Add description to the currently selected element
 */
export const addDescription = async (
  win: Page,
  description: string
): Promise<void> => {
  await enableDescriptionEdition(win);

  await typeText(description, win);
  // We click outside the box to save our description
  await win.mouse.click(10, 10);
};

/**
 * Triggers the RESIP export
 */
export const exportToResip = async (win: Page): Promise<void> => {
  await openExportMenu(win);
  await win
    .locator(
      `${makeTestIdSelector(
        "export-type-container-RESIP"
      )} input[type="checkbox"]`
    )
    .click();
  await getLocatorByTestId(win, "export-submit").click();
};
