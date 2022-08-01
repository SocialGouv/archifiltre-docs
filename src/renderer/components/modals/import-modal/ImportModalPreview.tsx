import type { LoadCsvFileToArrayOptions } from "@common/utils/csv";
import Box from "@material-ui/core/Box";
import type { FC } from "react";
import React from "react";

import { ImportModalFields } from "./ImportModalFields";
import type { ImportModalOptionsProps } from "./ImportModalOptions";
import { ImportModalOptions } from "./ImportModalOptions";

export interface ImportModalPreviewProps {
  metadataConfig: LoadCsvFileToArrayOptions;
  metadataRow?: Record<string, string>;
  onOptionChange: ImportModalOptionsProps["onChange"];
}

export const ImportModalPreview: FC<ImportModalPreviewProps> = ({
  metadataConfig,
  onOptionChange,
  metadataRow,
}) => (
  <Box display="flex" flexDirection="column" height="100%">
    <Box>
      <ImportModalOptions options={metadataConfig} onChange={onOptionChange} />
    </Box>
    <Box>
      <ImportModalFields previewData={metadataRow} />
    </Box>
  </Box>
);
