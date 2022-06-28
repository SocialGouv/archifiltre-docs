import type { ElectronApplication, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import parseCsv from "csv-parse/lib/sync";
import fs from "fs";
import path from "path";
import { sync as rimrafSync } from "rimraf";

import { createStructure } from "../utils/fs";
import {
  addDescription,
  addTag,
  clickIcicleElement,
  makeExport,
} from "./utils/app";
import { closeApp, startApp } from "./utils/test";

// eslint-disable-next-line @typescript-eslint/unbound-method
const { describe, beforeEach, afterEach, beforeAll, afterAll } = test;
const it = test;

const TEST_TIMEOUT = 20000;

const testFolderPath = path.resolve(__dirname, "../test-folder/");

describe("Export to tree CSV", () => {
  test.use({ navigationTimeout: TEST_TIMEOUT });

  beforeAll(async () => {
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
    rimrafSync(path.join(testFolderPath, "..","test-folder-treeCsv*.csv"));
    await closeApp(app);
  });

  it("should generate a valid tree csv export", async () => {
    test.slow();
    
    const tag0Name = "tag0";
    const tag1Name = "tag1";
    const description = "element description";

    await win.waitForSelector(`[data-test-id="main-icicle"]`);
    await (await win.waitForSelector(".notification-success")).click();

    await clickIcicleElement(win, "/test-folder/child/index.csv");

    await addTag(win, tag0Name);
    await addTag(win, tag1Name);
    await addDescription(win, description);

    await makeExport(win, "TREE_CSV");

    // Waiting for the CSV file to be created
    await win.waitForSelector(`text=/L'export csv hiérarchisé est terminé/`);

    // Finding the CSV export file
    const exportFolderPath = path.join(__dirname, "..");
    const exportFolder = fs.readdirSync(exportFolderPath);

    const treeCsvExportFilePath = exportFolder.find((folderName) =>
      /test-folder-treeCsv_/i.test(folderName)
    );

    if (treeCsvExportFilePath === undefined) {
      throw new Error("No CSV export file generated");
    }
  });
});
