import type { ElectronApplication, Page } from "@playwright/test";
import { test } from "@playwright/test";
import fs from "fs";
import path from "path";
import { sync as rimrafSync } from "rimraf";

import { createStructure } from "../utils/fs";
import {
  addDescription,
  addTag,
  clickIcicleElement,
  makeExport,
  waitForSuccessNotification,
} from "./utils/app";
import { closeApp, startApp } from "./utils/test";

// eslint-disable-next-line @typescript-eslint/unbound-method
const { describe, beforeEach, afterEach, beforeAll, afterAll } = test;
const it = test;

const TEST_TIMEOUT = 20000;

describe("Export deletion script", () => {
  test.use({ navigationTimeout: TEST_TIMEOUT });

  let testFolderName = "";
  let testFolderPath = "";

  beforeAll(async () => {
    testFolderName = `deletion-script-export-${Date.now()}`;
    testFolderPath = path.resolve(__dirname, "..", testFolderName);

    await createStructure({
      [testFolderPath]: {
        "child/": {
          "index.csv": `"dez";
`,
          "text.txt": `dedez
`,
        },
      },
    });
  });

  afterAll(() => {
    rimrafSync(testFolderPath);
  });

  let app: ElectronApplication, win: Page;
  beforeEach(async () => {
    [app, win] = await startApp(testFolderPath);
  });

  afterEach(async () => {
    rimrafSync(path.join(testFolderPath, "..", `${testFolderName}-delete*.sh`));
    await closeApp(app);
  });

  it("should generate a deletion script", async () => {
    test.slow();

    const tag0Name = "tag0";
    const tag1Name = "tag1";
    const description = "element description";

    await win.waitForSelector(`[data-test-id="main-icicle"]`);
    await (await win.waitForSelector(".notification-success")).click();

    await clickIcicleElement(win, `/${testFolderName}/child/index.csv`);

    await addTag(win, tag0Name);
    await addTag(win, tag1Name);
    await addDescription(win, description);

    await makeExport(win, "DELETION");

    // Waiting for the CSV file to be created
    await waitForSuccessNotification(win, ".deletion-script-export-success");

    // Finding the CSV export file
    const exportFolderPath = path.join(__dirname, "..");
    const exportFolder = fs.readdirSync(exportFolderPath);

    const csvExportFilePath = exportFolder.find((folderName) =>
      new RegExp(`${testFolderName}-delete_`, "i").test(folderName)
    );

    if (csvExportFilePath === undefined) {
      throw new Error("No CSV export file generated");
    }
  });
});
