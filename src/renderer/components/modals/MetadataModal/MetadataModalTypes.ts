import type { LoadCsvFileToArrayOptions } from "@common/utils/csv";

export type ImportModalState = "importDropzone" | "importPreview" | "view";

export type OptionChangeHandler = (config: FileConfig) => void;

export interface MetadataImportConfig {
  entityIdKey: string;
  fields: string[];
}

export interface ModalAction {
  id: string;
  label: string;
}

export type FieldConfig = string;

export type FieldsConfigChangeHandler = (
  newConfig: MetadataImportConfig
) => void;

export type FilePathPickedHandler = (path: string) => void;

export type FileConfig = LoadCsvFileToArrayOptions;

export type FileConfigChangeHandler = (fileConfig: FileConfig) => void;

export type MetadataLoadHandler = (config: MetadataImportConfig) => void;
