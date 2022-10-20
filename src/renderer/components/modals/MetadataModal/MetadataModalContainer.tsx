import React from "react";
import { useDispatch } from "react-redux";

import { useMachine } from "../../../lib/@xstate/react/useMachine";
import type { DispatchExts } from "../../../reducers/archifiltre-types";
import { useMetadataList } from "../../../reducers/metadata/metadata-selector";
import { importMetadataThunk } from "../../../reducers/metadata/metadata-thunk";
import { MetadataDialogContent } from "./MetadataDialogContent";
import { MetadataDialogFooter } from "./MetadataDialogFooter";
import MetadataModalContent from "./MetadataModalContent";
import { MetadataModalFilePicker } from "./MetadataModalFilePicker";
import { MetadataModalPreview } from "./MetadataModalPreview";
import type { SimpleMetadataEvents } from "./MetadataModalStateMachine/MetadataModalStateMachine";
import { metadataModalMachine } from "./MetadataModalStateMachine/MetadataModalStateMachine";
import type { MetadataModalContext, ModalAction } from "./MetadataModalTypes";
import { MetadataModalView } from "./MetadataModalView";

interface ImportModalContainerProps {
  closeModal: () => void;
  isModalOpen: boolean;
}

const importDropzoneActions: ModalAction<SimpleMetadataEvents["type"]>[] = [
  {
    id: "ABORT",
    label: "cancel",
  },
];

const metadataViewActions: ModalAction<SimpleMetadataEvents["type"]>[] = [
  {
    id: "IMPORT",
    label: "loadMetadata",
  },
];

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

  const onFilePathPicked = (filePath: string) => {
    send({
      filePath,
      type: "FILE_PATH_PICKED",
    });
  };

  const onRetry = () => send("RETRY");
  const onLoadMetadata = (context: MetadataModalContext) =>
    send({
      context,
      type: "LOAD_METADATA",
    });

  const onAction = (actionId: SimpleMetadataEvents["type"]) => {
    send(actionId);
  };

  return (
    <MetadataModalContent isModalOpen={isModalOpen} closeModal={closeModal}>
      {state.matches("importDropzone") && (
        <>
          <MetadataDialogContent>
            <MetadataModalFilePicker onFilePicked={onFilePathPicked} />
          </MetadataDialogContent>
          <MetadataDialogFooter
            actions={importDropzoneActions}
            closeModal={closeModal}
            onAction={onAction}
          />
        </>
      )}

      {state.matches("importPreview") && (
        <MetadataModalPreview
          context={state.context}
          onRetry={onRetry}
          onLoadMetadata={onLoadMetadata}
          closeModal={closeModal}
        />
      )}

      {state.matches("metadataView") && (
        <>
          <MetadataDialogContent>
            <MetadataModalView metadataList={metadataList} />{" "}
          </MetadataDialogContent>
          <MetadataDialogFooter
            actions={metadataViewActions}
            closeModal={closeModal}
            onAction={onAction}
          />
        </>
      )}
    </MetadataModalContent>
  );
};
