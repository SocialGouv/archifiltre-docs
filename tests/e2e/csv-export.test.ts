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

describe("Export to CSV", () => {
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
    rimrafSync(path.join(testFolderPath, "..","test-folder-csv_*.csv"));
    await closeApp(app);
  });

  it("should generate a valid csv export", async () => {
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

    await makeExport(win, "CSV");

    // Waiting for the CSV file to be created
    await win.waitForSelector(`text=/L'export CSV est terminé/`);

    // Finding the CSV export file
    const exportFolderPath = path.join(__dirname, "..");
    const exportFolder = fs.readdirSync(exportFolderPath);

    const csvExportFilePath = exportFolder.find((folderName) =>
      /test-folder-csv_/i.test(folderName)
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
      delimiter: ";",
      columns: true
    });

    expect(data.length).toBe(4);
    
    // folders are marked as folders
    const testedFolder = data.find((row: Record<string, string>) => row.chemin === "/test-folder/child");
    expect(testedFolder?.type).toBe("répertoire");
    
    // csv files are marked as csv files
    const testedFile = data.find((row: Record<string, string>) => row.chemin === "/test-folder/child/index.csv");
    expect(testedFile?.type).toBe("csv");
  });
});
