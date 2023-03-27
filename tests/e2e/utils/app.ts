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
  selector: string
): Promise<void> => {
  await win.waitForSelector(`.notification-success${selector}`);
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

type ExportType =
  | "AUDIT"
  | "CSV_WITH_HASHES"
  | "CSV"
  | "DELETION"
  | "EXCEL"
  | "RESIP"
  | "TREE_CSV";

/**
 * Triggers an export
 */
export const makeExport = async (
  win: Page,
  type: ExportType
): Promise<void> => {
  await openExportMenu(win);
  const exportTypeSelector = `export-type-container-${type}`;
  await win
    .locator(`${makeTestIdSelector(exportTypeSelector)} input[type="checkbox"]`)
    .click();
  await getLocatorByTestId(win, "export-submit").click();
};

export const closeNotification = async (win: Page): Promise<void> => {
  await win.locator(`button[aria-label="close"]`).click();
};

const openParams = async (win: Page): Promise<void> => {
  await win.waitForSelector(`button[id="settings-button"]`);
  await win.locator(`button[id="settings-button"]`).click();
  await win.locator(`text=/Settings|Paramètres|Einstellungen/`).click();
};

type Language = "de" | "en" | "fr";

const languageCloseAria = {
  de: "Close settings",
  en: "Close settings",
  fr: "Fermer les paramètres",
};

export const setLanguage = async (
  win: Page,
  language: Language
): Promise<void> => {
  await openParams(win);
  await win.selectOption("select", language);
  await win
    .locator(`button[aria-label="${languageCloseAria[language]}"]`)
    .click();
};
