import React, { FC, useCallback, useEffect } from "react";
import path from "path";
import styled from "styled-components";
import TextAlignCenter from "components/common/text-align-center";
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

const Dropzone = styled.div`
  border: 2px dashed #868686;
  border-radius: 3em;
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
      className="grid-y grid-frame align-center"
      onDragOver={handleDragover}
      onDrop={handleDrop}
    >
      <div className="cell">
        <TextAlignCenter>
          <Placeholder id="drag-drop-text">
            {t("folderDropzone.placeholder")}
          </Placeholder>
        </TextAlignCenter>
      </div>
      <div className="cell">
        <TextAlignCenter>
          <div>{t("folderDropzone.placeholderSubtitle")}</div>
        </TextAlignCenter>
      </div>
      <div className="cell">
        <TextAlignCenter>
          <div>
            <em>
              <br />
              {t("folderDropzone.disclaimerSubtitle")}
            </em>
          </div>
        </TextAlignCenter>
      </div>
    </Dropzone>
  );
};

export default FolderDropzone;
