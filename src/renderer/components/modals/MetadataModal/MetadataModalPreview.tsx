import Box from "@mui/material/Box";
import React, { type FC } from "react";

import { useMachine } from "../../../lib/@xstate/react/useMachine";
import { MetadataDialogContent } from "./MetadataDialogContent";
import { MetadataDialogFooter } from "./MetadataDialogFooter";
import { MetadataModalFields } from "./MetadataModalFields";
import { MetadataModalOptions } from "./MetadataModalOptions/MetadataModalOptions";
import MetadataModalPreviewHeader from "./MetadataModalPreviewHeader";
import {
  type ImportPreviewSimpleEvents,
  importPreviewStateMachine,
} from "./MetadataModalStateMachine/ImportPreviewStateMachine";
import {
  type FieldsConfigChangeHandler,
  type MetadataFileConfig,
  type MetadataModalContext,
  type ModalAction,
} from "./MetadataModalTypes";

const actions: Array<ModalAction<ImportPreviewSimpleEvents["type"]>> = [
  {
    id: "LOAD_METADATA",
    label: "loadMetadata",
  },
];

export interface ImportModalPreviewProps {
  closeModal: () => void;
  context: MetadataModalContext;
  onLoadMetadata: (context: MetadataModalContext) => void;
  onRetry: () => void;
}

export const MetadataModalPreview: FC<ImportModalPreviewProps> = ({ context, closeModal, onRetry, onLoadMetadata }) => {
  const [state, send] = useMachine(importPreviewStateMachine, { context });

  const onFieldsConfigChange: FieldsConfigChangeHandler = fieldsConfig => {
    send({
      fieldsConfig,
      type: "FIELDS_CONFIG_CHANGED",
    });
  };

  const onFileConfigChange = (config: MetadataFileConfig) => {
    send({
      config,
      type: "CONFIG_CHANGED",
    });
  };

  const onAction = (type: ImportPreviewSimpleEvents["type"]) => {
    send(type);

    if (type === "RETRY") {
      onRetry();
    }
    if (type === "LOAD_METADATA") {
      onLoadMetadata(state.context);
    }
  };

  return (
    <>
      <MetadataDialogContent>
        <Box display="flex" flexDirection="column" height="100%">
          <Box>
            <MetadataModalOptions options={state.context.config} onChange={onFileConfigChange} />
          </Box>
          <Box padding={2}>
            <MetadataModalPreviewHeader />
          </Box>
          <Box>
            <MetadataModalFields
              formValues={state.context.fieldsConfig}
              previewData={state.context.firstRow}
              onFormChange={onFieldsConfigChange}
            />
          </Box>
        </Box>
      </MetadataDialogContent>
      <MetadataDialogFooter actions={actions} closeModal={closeModal} onAction={onAction} />
    </>
  );
};
