import Grid from "@material-ui/core/Grid";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";
import styled from "styled-components";
import { expectToBeDefined } from "util/expect-behaviour/expect-behaviour";
import { notifyError } from "util/notification/notifications-util";

const Icon = styled(FaPlus)`
  width: 30px;
  height: auto;
  padding-bottom: 20px;
`;

const DropzoneContainer = styled(Grid)`
  border: 1px dashed #868686;
  border-radius: 5px;
  height: 100%;
`;

const PlaceholderContainer = styled(Grid)`
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Placeholder = styled.div`
  font-size: 1.5em;
  text-align: center;
`;

const handleDragover = (event) => {
  event.preventDefault();
};

type DropzoneProps = {
  loadPath: (path: string) => void;
  setLoadedPath: (loadedPath: string) => void;
};

const Dropzone: FC<DropzoneProps> = ({ loadPath, setLoadedPath }) => {
  const { t } = useTranslation();

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();

      const areMultipleFoldersDropped = event.dataTransfer.files.length > 1;

      if (areMultipleFoldersDropped) {
        notifyError(
          t("folderDropzone.multipleFoldersDroppedErrorMessage"),
          t("folderDropzone.multipleFoldersDroppedErrorTitle")
        );
        return;
      }

      const isFileDefined = expectToBeDefined(event.dataTransfer.files[0], "");

      if (!isFileDefined) {
        notifyError(
          t("folderDropzone.loadingErrorMessage"),
          t("folderDropzone.loadingErrorTitle")
        );
        return;
      }
      const pathToLoad = event.dataTransfer.files[0].path;
      setLoadedPath(pathToLoad);
      loadPath(pathToLoad);
    },
    [loadPath, setLoadedPath]
  );

  return (
    <DropzoneContainer
      container
      direction="row"
      justify="center"
      alignItems="center"
      onDragOver={handleDragover}
      onDrop={handleDrop}
    >
      <PlaceholderContainer item>
        <Icon />
        <Placeholder>{t("folderDropzone.placeholder")}</Placeholder>
      </PlaceholderContainer>
    </DropzoneContainer>
  );
};

export default Dropzone;
