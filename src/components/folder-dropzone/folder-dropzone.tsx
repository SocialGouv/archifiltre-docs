import Grid from "@material-ui/core/Grid";
import React, { FC, useCallback, useEffect } from "react";
import path from "path";
import styled from "styled-components";
import TextAlignCenter from "components/common/text-align-center";
import { expectToBeDefined } from "util/expect-behaviour/expect-behaviour";
import { notifyError } from "util/notification/notifications-util";
import { useTranslation } from "react-i18next";

declare global {
  const AUTOLOAD: string;
}

type FolderDropzoneProps = {
  loadFromPath: (path: string) => void;
};

const Dropzone = styled(Grid)`
  border: 1px dashed #868686;
  border-radius: 5px;
  height: 100%;
`;

const DropzoneWrapper = styled.div`
  width: 75%;
  height: 75%;
`;

const Placeholder = styled.div`
  font-size: 3em;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const FolderDropzone: FC<FolderDropzoneProps> = ({ loadFromPath }) => {
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

  const loadPath = useCallback(
    (loadedPath) => {
      loadFromPath(loadedPath);
    },
    [loadFromPath]
  );

  useEffect(() => {
    if (AUTOLOAD !== "") {
      const loadedPath = path.resolve(AUTOLOAD);
      loadPath(loadedPath);
    }
  }, []);

  return (
    <Wrapper>
      <DropzoneWrapper>
        <Dropzone
          container
          direction="row"
          justify="center"
          alignItems="center"
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
            <TextAlignCenter>
              <em>{t("folderDropzone.disclaimerSubtitle")}</em>
            </TextAlignCenter>
          </Grid>
        </Dropzone>
      </DropzoneWrapper>
    </Wrapper>
  );
};

export default FolderDropzone;
