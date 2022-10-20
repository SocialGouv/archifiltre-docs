import type { LoadCsvFileToArrayOptions } from "@common/utils/csv";

import type { SimpleMetadataEvents } from "./MetadataModalStateMachine";

export type ImportModalState = "importDropzone" | "importPreview" | "view";

export interface MetadataImportConfig {
  entityIdKey: string;
  fields: string[];
}

export interface ModalAction {
  id: SimpleMetadataEvents["type"];
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
