import { detectConfig } from "@common/utils/csv";
import { detectXlsxSheets } from "@common/utils/xlsx";
import * as path from "path";

import type {
  CsvMetadataFileConfig,
  MetadataFileConfig,
  XlsMetadataFileConfig,
} from "./MetadataModalTypes";

export const isCsvMetadataFileConfig = (
  config: MetadataFileConfig
): config is CsvMetadataFileConfig => config.type === "CSV";

export const detectXlsxConfig = (filePath: string): XlsMetadataFileConfig => {
  const sheets = detectXlsxSheets(filePath);

  return {
    selectedSheet: sheets[0],
    sheets,
    type: "XLS",
  };
};

export const detectCsvConfig = async (
  filePath: string
): Promise<CsvMetadataFileConfig> => {
  const config = await detectConfig(filePath);
  return {
    type: "CSV",
    ...config,
  };
};

export const isCsvFile = (filePath: string): boolean =>
  path.extname(filePath) === ".csv";
export const isXlsxFile = (filePath: string): boolean =>
  path.extname(filePath) === ".xlsx";
