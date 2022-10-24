import type { CsvFileLoadingOptions } from "@common/utils/csv";
import type { XlsxSheetName } from "@common/utils/xlsx";

export type CsvMetadataFileConfig = CsvFileLoadingOptions & {
  type: "CSV";
};

export interface XlsMetadataFileConfig {
  selectedSheet: XlsxSheetName;
  sheets: XlsxSheetName[];
  type: "XLS";
}

export type MetadataFileConfig = CsvMetadataFileConfig | XlsMetadataFileConfig;

export interface MetadataImportConfig {
  entityIdKey: string;
  fields: string[];
}

export interface MetadataModalContext {
  config: MetadataFileConfig;
  fieldsConfig: MetadataImportConfig;
  filePath: string;
  firstRow: Record<string, string> | undefined;
}

export interface ModalAction<T> {
  id: T;
  label: string;
}

export type FieldsConfigChangeHandler = (
  newConfig: MetadataImportConfig
) => void;

export type FilePathPickedHandler = (path: string) => void;

export type FileConfig = CsvFileLoadingOptions;

export type FileConfigChangeHandler = (fileConfig: FileConfig) => void;

export type MetadataLoadHandler = (config: MetadataImportConfig) => void;
