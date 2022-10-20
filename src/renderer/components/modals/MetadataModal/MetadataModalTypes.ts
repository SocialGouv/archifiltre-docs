import type { LoadCsvFileToArrayOptions } from "@common/utils/csv";

export interface MetadataImportConfig {
  entityIdKey: string;
  fields: string[];
}

export interface MetadataModalContext {
  config: LoadCsvFileToArrayOptions;
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

export type FileConfig = LoadCsvFileToArrayOptions;

export type FileConfigChangeHandler = (fileConfig: FileConfig) => void;

export type MetadataLoadHandler = (config: MetadataImportConfig) => void;
