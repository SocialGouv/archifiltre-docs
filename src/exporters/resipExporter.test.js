import { input, output } from "./resipExporter.test.data.json";
import resipExporter from "./resipExporter";
import { advanceTo } from "jest-date-mock";

// We advance to a specific date for TransactedDate to be setup correctly
advanceTo("2019-08-05");

describe("resipExporter", () => {
  describe("with a simple file structure", () => {
    it("should format the right csv", () => {
      expect(resipExporter(input)).toEqual(output);
    });
  });
});
