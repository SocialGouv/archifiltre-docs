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
  waitForSuccessNotification,
} from "./utils/app";
import { closeApp, startApp } from "./utils/test";

// eslint-disable-next-line @typescript-eslint/unbound-method
const { describe, beforeEach, afterEach, beforeAll, afterAll } = test;
const it = test;

const TEST_TIMEOUT = 20000;

describe("Export to CSV with Hashes", () => {
  test.use({ navigationTimeout: TEST_TIMEOUT });

  let testFolderName = "";
  let testFolderPath = "";

  beforeAll(async () => {
    testFolderName = `csv-with-hashes-${testFolderName}`;
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
    await closeApp(app);
    rimrafSync(
      path.join(testFolderPath, "..", `${testFolderName}-csvWithHashes_*.csv`)
    );
  });

  it("should generate a valid csv with hashes export", async () => {
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

    await makeExport(win, "CSV_WITH_HASHES");

    // Waiting for the CSV file to be created
    await waitForSuccessNotification(win, ".csv-export-success");

    // Finding the CSV export file
    const exportFolderPath = path.join(__dirname, "..");
    const exportFolder = fs.readdirSync(exportFolderPath);

    const csvExportFilePath = exportFolder.find((folderName) =>
      new RegExp(`${testFolderName}-csvWithHashes`, "i").test(folderName)
    );

    if (csvExportFilePath === undefined) {
      throw new Error("No CSV export file generated");
    }

    // Parsing the RESIP export file
    const csv = fs.readFileSync(
      path.join(exportFolderPath, csvExportFilePath),
      { encoding: "utf-8" }
    );

    const data = parseCsv(csv, {
      columns: true,
      delimiter: ";",
    });

    expect(data.length).toBe(4);
  });
});
