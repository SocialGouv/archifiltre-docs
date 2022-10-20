import React from "react";
import { useDispatch } from "react-redux";

import { useMachine } from "../../../lib/@xstate/react/useMachine";
import type { DispatchExts } from "../../../reducers/archifiltre-types";
import { useMetadataList } from "../../../reducers/metadata/metadata-selector";
import { importMetadataThunk } from "../../../reducers/metadata/metadata-thunk";
import MetadataModalContent from "./MetadataModalContent";
import { MetadataModalFilePicker } from "./MetadataModalFilePicker";
import { MetadataModalPreview } from "./MetadataModalPreview";
import type {
  MetadataModalContext,
  MetadataModalState,
  SimpleMetadataEvents,
} from "./MetadataModalStateMachine";
import { metadataModalMachine } from "./MetadataModalStateMachine";
import type {
  FieldsConfigChangeHandler,
  FileConfig,
  ModalAction,
} from "./MetadataModalTypes";
import { MetadataModalView } from "./MetadataModalView";

interface ImportModalContainerProps {
  closeModal: () => void;
  isModalOpen: boolean;
}

const getActionsByState = (state: MetadataModalState): ModalAction[] => {
  if (state.matches("importDropzone")) {
    return [
      {
        id: "ABORT",
        label: "cancel",
      },
    ];
  }

  if (state.matches("importPreview.view")) {
    return [
      {
        id: "LOAD_METADATA",
        label: "loadMetadata",
      },
    ];
  }

  if (state.matches("metadataView")) {
    return [
      {
        id: "IMPORT",
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
  const dispatch = useDispatch<DispatchExts>();

  const metadataList = useMetadataList();

  const loadMetadataService = (context: MetadataModalContext) => async () => {
    await dispatch(
      importMetadataThunk(context.filePath, {
        ...context.fieldsConfig,
        ...context.config,
      })
    );
  };

  const [state, send] = useMachine(metadataModalMachine, {
    services: {
      loadMetadata: loadMetadataService,
    },
  });

  const onFileConfigChange = (config: FileConfig) => {
    send({
      config,
      type: "CONFIG_CHANGED",
    });
  };

  const onFilePathPicked = (filePath: string) => {
    send({
      filePath,
      type: "FILE_PATH_PICKED",
    });
  };

  const onFieldsConfigChange: FieldsConfigChangeHandler = (fieldsConfig) => {
    send({
      fieldsConfig,
      type: "FIELDS_CONFIG_CHANGED",
    });
  };

  const onAction = (actionId: SimpleMetadataEvents["type"]) => {
    send(actionId);
  };

  const actions = getActionsByState(state);

  return (
    <MetadataModalContent
      actions={actions}
      closeModal={closeModal}
      isModalOpen={isModalOpen}
      onAction={onAction}
    >
      {state.matches("importDropzone") && (
        <MetadataModalFilePicker onFilePicked={onFilePathPicked} />
      )}

      {state.matches("importPreview") && (
        <MetadataModalPreview
          onFieldsConfigChange={onFieldsConfigChange}
          fieldsConfig={state.context.fieldsConfig}
          metadataConfig={state.context.config}
          metadataRow={state.context.firstRow}
          onFileConfigChange={onFileConfigChange}
        />
      )}

      {state.matches("metadataView") && (
        <MetadataModalView metadataList={metadataList} />
      )}
    </MetadataModalContent>
  );
};
