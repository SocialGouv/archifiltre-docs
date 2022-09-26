import Paper from "@material-ui/core/Paper";
import { useMachine } from "@xstate/react";
import React from "react";
import styled from "styled-components";

import MetadataModalContent from "./MetadataModalContent";
import type { MetadataModalState } from "./MetadataModalStateMachine";
import { metadataModalMachine } from "./MetadataModalStateMachine";
import type {
  FileConfig,
  MetadataImportConfig,
  ModalAction,
} from "./MetadataModalTypes";

interface ImportModalContainerProps {
  closeModal: () => void;
  isModalOpen: boolean;
}

const StyledPaper = styled(Paper)`
  height: 90%;
`;

const getActionsByState = (state: MetadataModalState): ModalAction[] => {
  if (state.matches("importDropzone")) {
    return [
      {
        id: "cancel",
        label: "cancel",
      },
    ];
  }

  if (state.matches("view")) {
    return [
      {
        id: "loadMetadata",
        label: "loadMetadata",
      },
    ];
  }

  return [];
};

export const MetadataModalContainer: React.FC<ImportModalContainerProps> = ({
  isModalOpen,
  closeModal,
}) => {
  const [state, send] = useMachine(metadataModalMachine);

  const onFileConfigChange = (config: FileConfig) =>
    send({
      config,
      type: "CONFIG_CHANGED",
    });

  const onFilePathPicked = (filePath: string) =>
    send({
      filePath,
      type: "FILE_PATH_PICKED",
    });

  const onMetadataLoad = (fieldsConfig: MetadataImportConfig) =>
    send({
      fieldsConfig,
      type: "LOAD_METADATA",
    });

  const onAction = (actionId: string) => {
    console.log(`action-${actionId}`);
  };

  const actions = getActionsByState(state);

  return (
    <MetadataModalContent
      actions={actions}
      closeModal={closeModal}
      isModalOpen={isModalOpen}
      onAction={onAction}
    >
      {state.value}
    </MetadataModalContent>
  );
};
