import type { ElectronApplication } from "@playwright/test";
import { expect, test } from "@playwright/test";
import parseCsv from "csv-parse/lib/sync";
import dateFormat from "dateformat";
import fs from "fs";
import path from "path";
import rimraf from "rimraf";

import {
  addDescription,
  addTags,
  clickIcicleElement,
  exportToResip,
  waitForSuccessNotification,
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
    await new Promise<void>((resolve, reject) => {
      rimraf("tests/test-folder/*-RESIP_*.csv", (err) => {
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

    const RESIP_EXPORT_SUCCESS_MESSAGE =
      "Fichier de métadonnées exporté dans le dossier racine du projet";

    const win = await app.firstWindow();

    await clickIcicleElement(win, "/tests/test-folder/child/index.csv");

    await addTags(win, [tag0Name, tag1Name]);
    await addDescription(win, description);

    await exportToResip(win);

    // Waiting for the RESIP file to be created
    await waitForSuccessNotification(win, RESIP_EXPORT_SUCCESS_MESSAGE);

    // Finding the RESIP export file
    const exportFolderPath = path.join(__dirname, "../tests/test-folder");
    const exportFolder = fs.readdirSync(exportFolderPath);

    const resipExportFilePath = exportFolder.find((folderName) =>
      /(Nom du projet|Project name)-RESIP_/.test(folderName)
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
    expect(lines).toContainEqual([
      "1",
      "",
      ".",
      "RecordGrp",
      "test-folder",
      "2019-11-20",
      "2019-11-20",
      todayDate,
      "",
      "",
      "",
      "",
    ]);
    expect(lines).toContainEqual([
      "2",
      "1",
      "child",
      "RecordGrp",
      "child",
      "2019-11-20",
      "2019-11-20",
      todayDate,
      "",
      "",
      "",
      "",
    ]);
    expect(lines).toContainEqual([
      "3",
      "2",
      "child/index.csv",
      "Item",
      "index.csv",
      "2019-11-20",
      "2019-11-20",
      todayDate,
      "",
      description,
      tag0Name,
      tag1Name,
    ]);
    expect(lines).toContainEqual([
      "4",
      "2",
      "child/text.txt",
      "Item",
      "text.txt",
      "2019-11-20",
      "2019-11-20",
      todayDate,
      "",
      "",
      "",
      "",
    ]);
  });
});
