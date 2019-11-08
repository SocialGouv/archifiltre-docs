import { advanceTo } from "jest-date-mock";
import { exportToDocX } from "../../util/docx-util";
import testData from "./audiReportExporter.test.data.json";
import auditReportExporter, { TEMPLATE_PATH } from "./auditReportExporter";

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
      auditReportExporter({
        files_and_folders: testData.input.files_and_folders
      });

      expect(exportToDocXMock).toHaveBeenCalledWith(
        TEMPLATE_PATH,
        testData.output
      );
    });
  });
});
