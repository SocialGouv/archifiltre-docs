import { advanceTo } from "jest-date-mock";
import path from "path";
import resipExporter from "./resip-exporter";
import { input, output } from "./resip-exporter.test.data.json";

// We advance to a specific date for TransactedDate to be setup correctly
advanceTo("2019-08-05");

describe("resip-exporter", () => {
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
      expect(
        resipExporter({
          aliases: input.aliases,
          comments: input.comments,
          elementsToDelete: ["/files/1bd93af4554f1/225e5b63fce14"],
          filesAndFolders: input.files_and_folders,
          tags: input.tags
        })
      ).toEqual(fileSystemFormatedOutput);
    });
  });
});
