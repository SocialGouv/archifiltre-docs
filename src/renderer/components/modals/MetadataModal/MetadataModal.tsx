import React from "react";

import { MetadataModalFilePicker } from "./MetadataModalFilePicker";
import { MetadataModalPreview } from "./MetadataModalPreview";
import type { MetadataModalState } from "./MetadataModalStateMachine";
import type {
  FileConfigChangeHandler,
  FilePathPickedHandler,
  MetadataLoadHandler,
} from "./MetadataModalTypes";

export interface ImportModalProps {
  onFileConfigChange: FileConfigChangeHandler;
  onFilePathPicked: FilePathPickedHandler;
  onMetadataLoad: MetadataLoadHandler;
  state: MetadataModalState;
}

export const MetadataModal: React.FC<ImportModalProps> = ({
  onFilePathPicked,
  onFileConfigChange,
  state,
}) => {
  return (
    <>
      {state.matches("importDropzone") && (
        <MetadataModalFilePicker onFilePicked={onFilePathPicked} />
      )}
      {state.matches("importPreview") && (
        <MetadataModalPreview
          fieldsConfig={state.context.fieldsConfig}
          metadataConfig={state.context.config}
          metadataRow={state.context.firstRow}
          onOptionChange={onFileConfigChange}
        />
      )}
    </>
  );
};
