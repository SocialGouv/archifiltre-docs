import Grid from "@material-ui/core/Grid";
import React, { FC, useCallback, useEffect } from "react";
import path from "path";
import styled from "styled-components";
import { expectToBeDefined } from "../../util/expect-behaviour";
import { notifyError } from "../../util/notifications-util";
import { useTranslation } from "react-i18next";

declare global {
  const AUTOLOAD: string;
}

interface FolderDropzoneProps {
  loadFromPath;
  api;
  setLoadedPath;
}

const Dropzone = styled(Grid)`
  border: 1px dashed #868686;
  border-radius: 5px;
`;

const Placeholder = styled.div`
  font-size: 3em;
`;

const FolderDropzone: FC<FolderDropzoneProps> = ({
  loadFromPath,
  api,
  setLoadedPath,
}) => {
  const { t } = useTranslation();

  const handleDragover = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();

    const isFileDefined = expectToBeDefined(event.dataTransfer.files[0], "");

    if (!isFileDefined) {
      notifyError(
        t("folderDropzone.loadingErrorMessage"),
        t("folderDropzone.loadingErrorTitle")
      );
      return;
    }

    loadPath(event.dataTransfer.files[0].path);
  }, []);

  const loadPath = useCallback((loadedPath) => {
    setLoadedPath(loadedPath);
    loadFromPath(loadedPath, { api });
  }, []);

  useEffect(() => {
    if (AUTOLOAD !== "") {
      const loadedPath = path.resolve(AUTOLOAD);
      loadPath(loadedPath);
    }
  }, []);

  return (
    <Dropzone
      container
      direction="row"
      justify="center"
      alignItems="center"
      spacing={3}
      onDragOver={handleDragover}
      onDrop={handleDrop}
    >
      <Grid item>
        <Placeholder>{t("folderDropzone.placeholder")}</Placeholder>
      </Grid>
      <Grid item>
        <div>{t("folderDropzone.placeholderSubtitle")}</div>
      </Grid>
      <Grid item>
        <em>{t("folderDropzone.disclaimerSubtitle")}</em>
      </Grid>
    </Dropzone>
  );
};

export default FolderDropzone;
