import React from "react";
import { useTranslation } from "react-i18next";

import { notifyError } from "../../utils/notifications";
import { Dropzone, type DropzoneErrorType } from "../common/dropzone";

export interface DropzoneProps {
  loadPath: (path: string) => void;
  setLoadedPath: (loadedPath: string) => void;
}

export const StartscreenDropzone: React.FC<DropzoneProps> = ({ loadPath, setLoadedPath }) => {
  const { t } = useTranslation();

  const onPathLoaded = (path: string) => {
    loadPath(path);
    setLoadedPath(path);
  };

  const onError = (error: DropzoneErrorType) => {
    switch (error) {
      case "invalidElementDropped":
        notifyError(t("folderDropzone.loadingErrorMessage"), t("folderDropzone.loadingErrorTitle"));
        break;

      case "multipleFolderLoaded":
        notifyError(
          t("folderDropzone.multipleFoldersDroppedErrorMessage"),
          t("folderDropzone.multipleFoldersDroppedErrorTitle"),
        );
        break;
    }
  };

  return (
    <Dropzone
      placeholder={t("folderDropzone.placeholder")}
      onPathLoaded={onPathLoaded}
      onError={onError}
      loadPath={loadPath}
    />
  );
};
