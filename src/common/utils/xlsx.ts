import { readFile, utils } from "xlsx";

export type XlsxSheetName = string;

export const detectXlsxSheets = (filePath: string): XlsxSheetName[] => {
  const workbook = readFile(filePath);

  return workbook.SheetNames;
};

export const loadXlsxFirstRow = (
  filePath: string,
  sheetName: XlsxSheetName
): Record<string, string> => loadXlsx(filePath, sheetName)[0];

export const loadXlsx = (
  filePath: string,
  sheetName: XlsxSheetName
): Record<string, string>[] => {
  const workbook = readFile(filePath);
  return utils.sheet_to_json<Record<string, string>>(
    workbook.Sheets[sheetName]
  );
};
