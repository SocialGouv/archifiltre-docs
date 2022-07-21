import React from "react";
import { useDispatch } from "react-redux";

import { importMetadataThunk } from "../../../reducers/metadata/metadata-thunk";
import { ImportModal } from "./ImportModal";

interface ImportModalContainerProps {
  closeModal: () => void;
  isModalOpen: boolean;
}

export const ImportModalContainer: React.FC<ImportModalContainerProps> = ({
  isModalOpen,
  closeModal,
}) => {
  const dispatch = useDispatch();

  const importMetadata = (path: string) => {
    dispatch(
      importMetadataThunk(path, {
        delimiter: ";",
        entityIdKey: "path",
      })
    );
  };

  return (
    <ImportModal
      isModalOpen={isModalOpen}
      closeModal={closeModal}
      importMetadata={importMetadata}
    />
  );
};
