import testData from "./audiReportExporter.test.data.json";
import auditReportExporter from "./auditReportExporter";
import { TEMPLATE_PATH } from "./auditReportExporter";
import { exportToDocX } from "../util/docx-util";
import { advanceTo } from "jest-date-mock";

jest.mock("../util/docx-util", () => ({
  exportToDocX: jest.fn()
}));

describe("auditReportExporter", () => {
  describe("with test data", () => {
    it("should generate the right report data", () => {
      advanceTo(new Date("2019-09-04"));
      exportToDocX.mockReset();
      exportToDocX.mockReturnValue("docxBlob");
      auditReportExporter({
        files_and_folders: testData.input.files_and_folders
      });

      expect(exportToDocX).toHaveBeenCalledWith(
        //"template/auditTemplate.docx",
        TEMPLATE_PATH,
        testData.output
      );
    });
  });
});
