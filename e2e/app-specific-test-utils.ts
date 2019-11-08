import { clickOnPosition, clickOverElement, typeText } from "./e2e-test-utils";

/**
 * Returns a promise that resolves when the app is ready
 * @param app - The spectron app object
 */
export const waitForAppReady = async (app): Promise<void> => {
  await app.browserWindow.isVisible();
  await app.client.waitForExist(makeTestIdSelector("export-menu"));
};

/**
 * Opens the export menu
 * @param app - The spectron app object
 */
export const openExportMenu = async (app): Promise<void> => {
  await clickOverElement(app, getElementByTestId(app, "export-menu"));
};

/**
 * Returns a promise that resolves when the notification appears
 * @param app - The spectron app object
 * @param notificationText - The text of the notification to await
 */
export const waitForSuccessNotification = async (
  app,
  notificationText
): Promise<void> => {
  await app.client.waitUntilTextExists(
    ".notification-success .message",
    notificationText
  );
};

/**
 * Clicks an icicle element based on the related file path
 * @param app - The spectron app
 * @param filePath - The path of the file corresponding to the icicle element
 */
export const clickIcicleElement = async (
  app,
  filePath: string
): Promise<void> => {
  await clickOverElement(app, getElementByTestId(app, filePath));
};

/**
 * Generates the selector for the specified testId
 * @param testId - the id of the element
 */
const makeTestIdSelector = (testId: string) => `[data-test-id="${testId}"]`;

/**
 * Selects an element by its testId
 * @param app - The spectron app object
 * @param testId - The data-test-id
 */
export const getElementByTestId = (app, testId: string) =>
  app.client.$(makeTestIdSelector(testId));

/**
 * Start editing tag box
 * @param app - The spectron app object
 */
const enableTagEdition = async app => {
  await getElementByTestId(app, "tag-edit-box").click();
};

/**
 * Start editing tag box
 * @param app - The spectron app object
 */
const enableDescriptionEdition = async app => {
  await getElementByTestId(app, "description-edit-box").click();
};

/**
 * Add tags to the currently selected element
 * @param app - The spectron app object
 * @param tags - The list of the tag names to add
 */
export const addTags = async (app, tags: string[]): Promise<void> => {
  await enableTagEdition(app);

  const keyboardInputs = tags.join("\n") + "\n";
  await typeText(app, keyboardInputs);
};

/**
 * Add description to the currently selected element
 * @param app - The spectron app object
 * @param description - The description to add
 */
export const addDescription = async (
  app,
  description: string
): Promise<void> => {
  await enableDescriptionEdition(app);

  await typeText(app, description);
  // We click outside the box to save our description
  await clickOnPosition(app, 10, 10);
};

/**
 * Triggers the RESIP export
 * @param app - The spectron app object
 */
export const exportToResip = async (app): Promise<void> => {
  await openExportMenu(app);
  await getElementByTestId(app, "resip-button").click();
};
