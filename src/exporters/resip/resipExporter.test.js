import path from "path";
import { input, output } from "./resipExporter.test.data.json";
import resipExporter from "./resipExporter";
import { advanceTo } from "jest-date-mock";

// We advance to a specific date for TransactedDate to be setup correctly
advanceTo("2019-08-05");

describe("resipExporter", () => {
  describe("with a simple file structure", () => {
    it("should format the right csv", () => {
      const fileSystemFormatedOutput = output.map(
        ([id, parentId, file, ...rest], index) => {
          if (index === 0) {
            return [id, parentId, file, ...rest];
          }
          return [id, parentId, path.join(file), ...rest];
        }
      );
      expect(resipExporter(input.files_and_folders, input.tags)).toEqual(
        fileSystemFormatedOutput
      );
    });
  });
});
