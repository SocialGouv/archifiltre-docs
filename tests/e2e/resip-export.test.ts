import type { ElectronApplication, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import parseCsv from "csv-parse/lib/sync";
import dateFormat from "dateformat";
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
import { getTextSelector } from "./utils/lang";
import { closeApp, startApp } from "./utils/test";

// eslint-disable-next-line @typescript-eslint/unbound-method
const { describe, beforeEach, afterEach, beforeAll, afterAll } = test;
const it = test;

const TEST_TIMEOUT = 20000;

const testFolderPath = path.resolve(__dirname, "../test-folder/");

describe("Export to RESIP", () => {
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
    rimrafSync(path.join(testFolderPath, "test-folder-resip*.csv"));
    await closeApp(app);
  });

  it("should generate a valid resip export", async () => {
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

    await makeExport(win, "RESIP");

    // Waiting for the RESIP file to be created
    await win.waitForSelector(
      getTextSelector("export.resipExportSuccessMessage")
    );

    // Finding the RESIP export file
    const exportFolderPath = path.join(__dirname, "../test-folder");
    const exportFolder = fs.readdirSync(exportFolderPath);

    const resipExportFilePath = exportFolder.find((folderName) =>
      /test-folder-resip/i.test(folderName)
    );

    if (resipExportFilePath === undefined) {
      throw new Error("No resip export file generated");
    }

    // Parsing the RESIP export file
    const resipCsv = fs.readFileSync(
      path.join(exportFolderPath, resipExportFilePath),
      { encoding: "utf-8" }
    );
    const [header, ...lines] = parseCsv(resipCsv, {
      delimiter: ";",
    });

    expect(header).toEqual([
      "ID",
      "ParentID",
      "File",
      "DescriptionLevel",
      "Title",
      "StartDate",
      "EndDate",
      "TransactedDate",
      "CustodialHistory.CustodialHistoryItem",
      "Description",
      "Content.Tag.0",
      "Content.Tag.1",
    ]);

    const todayDate = dateFormat(Date.now(), "yyyy-mm-dd");
    const expected = [
      [
        "1",
        "2",
        path.normalize("child/index.csv"),
        "Item",
        "index.csv",
        todayDate,
        todayDate,
        todayDate,
        "",
        "element description",
        "tag0",
        "tag1",
      ],
      [
        "2",
        "3",
        "child",
        "RecordGrp",
        "child",
        todayDate,
        todayDate,
        todayDate,
        "",
        "",
        "",
        "",
      ],
      [
        "3",
        "",
        ".",
        "RecordGrp",
        "test-folder",
        todayDate,
        todayDate,
        todayDate,
        "",
        "",
        "",
        "",
      ],
      [
        "4",
        "2",
        path.normalize("child/text.txt"),
        "Item",
        "text.txt",
        todayDate,
        todayDate,
        todayDate,
        "",
        "",
        "",
        "",
      ],
    ];
    expect(lines).toEqual(expected);
  });
});
