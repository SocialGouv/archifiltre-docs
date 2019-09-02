import testData from "./audiReportExporter.test.data.json";
import auditReportExporter from "./auditReportExporter";
import { exportToDocX } from "../util/docx-util";

jest.mock("../util/docx-util", () => ({
  exportToDocX: jest.fn()
}));

describe("auditReportExporter", () => {
  describe("with test data", () => {
    it("should generate the right report data", () => {
      exportToDocX.mockReset();
      exportToDocX.mockReturnValue("docxBlob");
      auditReportExporter({
        files_and_folders: testData.input.files_and_folders
      });

      expect(exportToDocX).toHaveBeenCalledWith(
        "template/auditTemplate.docx",
        testData.output
      );
    });
  });
});
