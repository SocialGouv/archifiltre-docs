import type { LoadCsvFileToArrayOptions } from "@common/utils/csv";
import React from "react";

import { ImportModalFilePicker } from "./ImportModalFilePicker";
import type { ImportModalPreviewProps } from "./ImportModalPreview";
import { ImportModalPreview } from "./ImportModalPreview";
import type {
  FieldsConfigChangeHandler,
  ImportModalState,
  MetadataImportConfig,
  PathChangeHandler,
} from "./ImportModalTypes";

export interface ImportModalProps {
  fieldsConfig: MetadataImportConfig;
  metadataConfig: LoadCsvFileToArrayOptions;
  metadataRow?: Record<string, string>;
  onFieldsConfigChange: FieldsConfigChangeHandler;
  onOptionChange: ImportModalPreviewProps["onOptionChange"];
  onPathChange: PathChangeHandler;
  state: ImportModalState;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  fieldsConfig,
  onPathChange,
  metadataRow,
  metadataConfig,
  onFieldsConfigChange,
  onOptionChange,
  state,
}) => {
  return (
    <>
      {state === "initial" && (
        <ImportModalFilePicker onFilePicked={onPathChange} />
      )}
      {state === "preview" && (
        <ImportModalPreview
          fieldsConfig={fieldsConfig}
          metadataConfig={metadataConfig}
          metadataRow={metadataRow}
          onFieldsConfigChange={onFieldsConfigChange}
          onOptionChange={onOptionChange}
        />
      )}
    </>
  );
};
