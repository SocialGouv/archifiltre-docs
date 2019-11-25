import { createFilesAndFolders } from "../reducers/files-and-folders/files-and-folders-test-utils";
import { FilesAndFolders } from "../reducers/files-and-folders/files-and-folders-types";
import { FileType, getFileType } from "./file-types-util";

const createFileWithExt = (extension: string): FilesAndFolders =>
  createFilesAndFolders({
    id: `folder/file.${extension}`,
    name: `file.${extension}`
  });

describe("file-types-util", () => {
  describe("getFileType", () => {
    it("should return the right type for media", () => {
      const mkvFile = createFileWithExt("mkv");
      expect(getFileType(mkvFile)).toBe(FileType.MEDIA);
    });

    it("should return the right type for spreadsheet", () => {
      const xlsFile = createFileWithExt("xls");
      expect(getFileType(xlsFile)).toBe(FileType.SPREADSHEET);
    });

    it("should return the right type for document", () => {
      const docxFile = createFileWithExt("docx");
      expect(getFileType(docxFile)).toBe(FileType.DOCUMENT);
    });

    it("should return the right type for presentation", () => {
      const pptxFile = createFileWithExt("pptx");
      expect(getFileType(pptxFile)).toBe(FileType.PRESENTATION);
    });

    it("should return the right type for email", () => {
      const emlFile = createFileWithExt("eml");
      expect(getFileType(emlFile)).toBe(FileType.EMAIL);
    });

    it("should return the right type for unknown type", () => {
      const xmlFile = createFileWithExt("xml");
      expect(getFileType(xmlFile)).toBe(FileType.OTHER);
    });
  });
});
