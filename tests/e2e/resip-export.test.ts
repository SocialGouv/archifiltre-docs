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
  waitForSuccessNotification,
} from "./utils/app";
import { closeApp, startApp } from "./utils/test";

// eslint-disable-next-line @typescript-eslint/unbound-method
const { describe, beforeEach, afterEach, beforeAll, afterAll } = test;
const it = test;

const TEST_TIMEOUT = 20000;

describe("Export to RESIP", () => {
  test.use({ navigationTimeout: TEST_TIMEOUT });

  let testFolderName = "";
  let testFolderPath = "";

  beforeAll(async () => {
    testFolderName = `resip-${Date.now()}`;
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
    rimrafSync(path.join(testFolderPath, `${testFolderName}-resip*.csv`));
    await closeApp(app);
  });

  it("should generate a valid resip export", async () => {
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

    await makeExport(win, "RESIP");

    // Waiting for the RESIP file to be created
    await waitForSuccessNotification(win, ".resip-export-success");

    // Finding the RESIP export file
    const exportFolderPath = testFolderPath;
    const exportFolder = fs.readdirSync(exportFolderPath);

    const resipExportFilePath = exportFolder.find((folderName) =>
      new RegExp(`${testFolderName}-resip`, "i").test(folderName)
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
    const expectedRows = [
      [
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
        ".",
        "RecordGrp",
        testFolderName,
        todayDate,
        todayDate,
        todayDate,
        "",
        "",
        "",
        "",
      ],
      [
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

    expect(lines.length).toBe(expectedRows.length);

    expectedRows.forEach((row) => {
      const testedRow = lines.find(
        ([, , elementPath]: string[]) => row[0] === elementPath
      );
      expect(testedRow).toEqual(expect.arrayContaining(row));
    });
  });
});
