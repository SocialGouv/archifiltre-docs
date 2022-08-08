import type { LoadCsvFileToArrayOptions } from "@common/utils/csv";
import Box from "@material-ui/core/Box";
import type { FC } from "react";
import React from "react";

import { ImportModalFields } from "./ImportModalFields";
import type { ImportModalOptionsProps } from "./ImportModalOptions";
import { ImportModalOptions } from "./ImportModalOptions";
import ImportModalPreviewHeader from "./ImportModalPreviewHeader";
import type {
  FieldsConfigChangeHandler,
  MetadataImportConfig,
} from "./ImportModalTypes";

export interface ImportModalPreviewProps {
  fieldsConfig: MetadataImportConfig;
  metadataConfig: LoadCsvFileToArrayOptions;
  metadataRow?: Record<string, string>;
  onFieldsConfigChange: FieldsConfigChangeHandler;
  onOptionChange: ImportModalOptionsProps["onChange"];
}

export const ImportModalPreview: FC<ImportModalPreviewProps> = ({
  fieldsConfig,
  metadataConfig,
  onFieldsConfigChange,
  onOptionChange,
  metadataRow,
}) => (
  <Box display="flex" flexDirection="column" height="100%">
    <Box>
      <ImportModalPreviewHeader />
    </Box>
    <Box>
      <ImportModalOptions options={metadataConfig} onChange={onOptionChange} />
    </Box>
    <Box>
      <ImportModalFields
        formValues={fieldsConfig}
        onFormChange={onFieldsConfigChange}
        previewData={metadataRow}
      />
    </Box>
  </Box>
);
