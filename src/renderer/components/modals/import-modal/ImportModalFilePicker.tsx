import { ipcRenderer } from "@common/ipc";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import { notifyError } from "../../../utils/notifications";
import { Dropzone } from "../../common/dropzone";

const importModalValidExtensions = ["csv"];

interface ImportModalFilePickerProps {
  onFilePicked: (filePath: string) => void;
}

export const ImportModalFilePicker: FC<ImportModalFilePickerProps> = ({
  onFilePicked,
}) => {
  const { t } = useTranslation();
  const onError = () => {
    notifyError(
      t("importModal.loadingErrorMessage"),
      t("importModal.loadingErrorTitle")
    );
  };

  const onClick = async () => {
    const chosenPath = await ipcRenderer.invoke("dialog.showOpenDialog", {
      filters: [
        {
          extensions: importModalValidExtensions,
          name: t("importModal.metadataFile"),
        },
      ],
      properties: ["openFile"],
    });
    if (chosenPath.filePaths.length > 0) {
      onFilePicked(chosenPath.filePaths[0]);
    }
  };

  return (
    <Dropzone
      onError={onError}
      onPathLoaded={onFilePicked}
      onClick={onClick}
      placeholder={t("importModal.dropAMetadataFile")}
    />
  );
};
