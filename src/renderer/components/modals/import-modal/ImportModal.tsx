import type { LoadCsvFileToArrayOptions } from "@common/utils/csv";
import Paper from "@material-ui/core/Paper";
import React from "react";
import styled from "styled-components";

import { ImportModalFilePicker } from "./ImportModalFilePicker";
import type { ImportModalPreviewProps } from "./ImportModalPreview";
import { ImportModalPreview } from "./ImportModalPreview";
import type { ImportModalState, PathChangeHandler } from "./ImportModalTypes";

const StyledPaper = styled(Paper)`
  height: 90%;
`;

export interface ImportModalProps {
  metadataConfig: LoadCsvFileToArrayOptions;
  metadataRow?: Record<string, string>;
  onOptionChange: ImportModalPreviewProps["onOptionChange"];
  onPathChange: PathChangeHandler;
  state: ImportModalState;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  onPathChange,
  metadataRow,
  metadataConfig,
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
          metadataConfig={metadataConfig}
          metadataRow={metadataRow}
          onOptionChange={onOptionChange}
        />
      )}
    </>
  );
};
