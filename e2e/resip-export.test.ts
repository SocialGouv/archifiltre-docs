import parseCsv from "csv-parse/lib/sync";
import dateFormat from "dateformat";
import fs from "fs";
import path from "path";
import rmfr from "rmfr";
import {
  addDescription,
  addTags,
  clickIcicleElement,
  exportToResip,
  waitForAppReady,
  waitForSuccessNotification,
} from "./app-specific-test-utils";
import { startApp } from "./e2e-test-utils";

const TEST_TIMEOUT = 20000;

describe("Export to RESIP", () => {
  let app;
  beforeEach(async () => {
    app = await startApp();
  }, 10000);

  afterEach(async () => {
    await rmfr("test-folder/*-RESIP_*.csv", { glob: true });
    if (app && app.isRunning()) {
      return app.stop();
    }
  }, 10000);

  it(
    "should generate a valid resip export",
    () => {
      return app.client.getWindowCount().then(async () => {
        const tag0Name = "tag0";
        const tag1Name = "tag1";
        const description = "element description";

        const RESIP_EXPORT_SUCCESS_MESSAGE =
          "Fichier de métadonnées exporté dans le dossier racine du projet";

        await waitForAppReady(app);

        await clickIcicleElement(app, "/test-folder/child/index.csv");

        await addTags(app, [tag0Name, tag1Name]);
        await addDescription(app, description);

        await exportToResip(app);

        // Waiting for the RESIP file to be created
        await waitForSuccessNotification(app, RESIP_EXPORT_SUCCESS_MESSAGE);

        // Finding the RESIP export file
        const exportFolderPath = path.join(__dirname, "../test-folder");
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
        const [header, ...lines] = parseCsv(resipCsv, { delimiter: ";" });

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
    },
    TEST_TIMEOUT
  );
});
