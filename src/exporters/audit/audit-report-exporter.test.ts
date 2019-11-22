import { advanceTo } from "jest-date-mock";
import { exportToDocX } from "../../util/docx-util";
import auditReportExporter, { TEMPLATE_PATH } from "./audit-report-exporter";
import testData from "./audit-report-exporter.test.data.json";

jest.mock("../../util/docx-util", () => ({
  exportToDocX: jest.fn()
}));

const exportToDocXMock = exportToDocX as jest.Mock;

describe("auditReportExporter", () => {
  describe("with test data", () => {
    it("should generate the right report data", () => {
      advanceTo(new Date("2019-09-04"));
      exportToDocXMock.mockReset();
      exportToDocXMock.mockReturnValue("docxBlob");
      auditReportExporter(testData.input.files_and_folders);

      expect(exportToDocXMock).toHaveBeenCalledWith(
        TEMPLATE_PATH,
        testData.output
      );
    });
  });
});
