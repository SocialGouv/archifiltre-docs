import type { LoadCsvFileToArrayOptions } from "@common/utils/csv";
import Box from "@material-ui/core/Box";
import type { FC } from "react";
import React from "react";

import type { ImportModalFieldsProps } from "./MetadataModalFields";
import { MetadataModalFields } from "./MetadataModalFields";
import type { ImportModalOptionsProps } from "./MetadataModalOptions";
import { MetadataModalOptions } from "./MetadataModalOptions";
import MetadataModalPreviewHeader from "./MetadataModalPreviewHeader";
import type { MetadataImportConfig } from "./MetadataModalTypes";

export interface ImportModalPreviewProps {
  fieldsConfig: MetadataImportConfig;
  metadataConfig: LoadCsvFileToArrayOptions;
  metadataRow?: Record<string, string>;
  onFieldsConfigChange: ImportModalFieldsProps["onFormChange"];
  onFileConfigChange: ImportModalOptionsProps["onChange"];
}

export const MetadataModalPreview: FC<ImportModalPreviewProps> = ({
  fieldsConfig,
  metadataConfig,
  onFieldsConfigChange,
  onFileConfigChange,
  metadataRow,
}) => (
  <Box display="flex" flexDirection="column" height="100%">
    <Box>
      <MetadataModalOptions
        options={metadataConfig}
        onChange={onFileConfigChange}
      />
    </Box>
    <Box padding={2}>
      <MetadataModalPreviewHeader />
    </Box>
    <Box>
      <MetadataModalFields
        formValues={fieldsConfig}
        previewData={metadataRow}
        onFormChange={onFieldsConfigChange}
      />
    </Box>
  </Box>
);
