import type { ElectronApplication } from "@playwright/test";
import { expect, test } from "@playwright/test";
import parseCsv from "csv-parse/lib/sync";
import dateFormat from "dateformat";
import fs from "fs";
import path from "path";
import rimraf from "rimraf";

import {
  addDescription,
  addTag,
  clickIcicleElement,
  exportToResip,
} from "./utils/app";
import { startApp } from "./utils/test";

// eslint-disable-next-line @typescript-eslint/unbound-method
const { describe, beforeEach, afterEach } = test;
const it = test;

const TEST_TIMEOUT = 20000;

describe("Export to RESIP", () => {
  test.use({ navigationTimeout: TEST_TIMEOUT });

  let app: ElectronApplication;
  beforeEach(async () => {
    app = await startApp();
  });

  afterEach(async () => {
    const cwd = path.resolve(__dirname, "../test-folder/");
    await new Promise<void>((resolve, reject) => {
      rimraf(path.join(cwd, "test-folder-resip*.csv"), (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    await app.close();
  });

  it("should generate a valid resip export", async () => {
    const tag0Name = "tag0";
    const tag1Name = "tag1";
    const description = "element description";

    const win = await app.firstWindow();

    await win.waitForSelector(`[data-test-id="main-icicle"]`);
    await (await win.waitForSelector(".notification-success")).click();

    await clickIcicleElement(win, "/test-folder/child/index.csv");

    await addTag(win, tag0Name);
    await addTag(win, tag1Name);
    await addDescription(win, description);

    await exportToResip(win);

    // Waiting for the RESIP file to be created
    await win.waitForSelector(".notification-success");

    // Finding the RESIP export file
    const exportFolderPath = path.join(__dirname, "../test-folder");
    const exportFolder = fs.readdirSync(exportFolderPath);

    console.log({ exportFolder });
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
        "child/index.csv",
        "Item",
        "index.csv",
        "2021-09-01",
        "2021-09-01",
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
        "2021-09-01",
        "2021-09-01",
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
        "2021-09-01",
        "2021-09-01",
        todayDate,
        "",
        "",
        "",
        "",
      ],
      [
        "4",
        "2",
        "child/text.txt",
        "Item",
        "text.txt",
        "2021-09-01",
        "2021-09-01",
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
