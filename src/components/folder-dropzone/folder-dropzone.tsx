import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FolderDropzoneSidebar from "components/folder-dropzone/folder-dropzone-sidebar";
import SettingsModal from "components/modals/settings-modal/settings-modal";
import { useModal } from "hooks/use-modal";
import { savePreviousSession } from "persistence/previous-sessions";
import React, { FC, useCallback, useEffect } from "react";
import path from "path";
import { FaEye, FaLock, FaPlus } from "react-icons/fa";
import styled from "styled-components";
import { expectToBeDefined } from "util/expect-behaviour/expect-behaviour";
import { notifyError } from "util/notification/notifications-util";
import { useTranslation } from "react-i18next";
import logo from "../../../static/imgs/logo.png";

declare global {
  const AUTOLOAD: string;
}

type FolderDropzoneProps = {
  loadFromPath: (path: string) => void;
  hasPreviousSession: boolean;
  reloadPreviousSession: () => void;
};

const DropzoneWrapper = styled(Grid)`
  flex: 1;
`;

const Dropzone = styled(Grid)`
  border: 1px dashed #868686;
  border-radius: 5px;
  height: 100%;
`;

const Placeholder = styled.div`
  font-size: 1.5em;
  text-align: center;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const PlaceholderContainer = styled(Grid)`
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FullHeightGrid = styled(Grid)`
  height: 100%;
`;

const FolderDropzone: FC<FolderDropzoneProps> = ({
  loadFromPath,
  hasPreviousSession,
  reloadPreviousSession,
}) => {
  const { t } = useTranslation();
  const { isModalOpen, openModal, closeModal } = useModal();

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
      savePreviousSession(loadedPath);
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
      <FolderDropzoneSidebar
        hasPreviousSession={hasPreviousSession}
        reloadPreviousSession={reloadPreviousSession}
        openModal={openModal}
        loadPath={loadPath}
      />
      <FullHeightGrid
        container
        direction="column"
        alignItems="center"
        spacing={6}
      >
        <Grid item>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box pb={2}>
              <img alt="Logo Archifiltre" src={logo} height={40} />
            </Box>
            <Typography variant="h3">{t("folderDropzone.slug")}</Typography>
          </Box>
        </Grid>
        <DropzoneWrapper item>
          <Dropzone
            container
            direction="row"
            justify="center"
            alignItems="center"
            onDragOver={handleDragover}
            onDrop={handleDrop}
          >
            <PlaceholderContainer item>
              <FaPlus />
              <Placeholder>{t("folderDropzone.placeholder")}</Placeholder>
            </PlaceholderContainer>
          </Dropzone>
        </DropzoneWrapper>
        <Grid item>
          <Box display="flex" pb={2}>
            <FaLock />
            &nbsp;
            <Typography variant="body1">
              {t("folderDropzone.disclaimerSubtitle")}
              <br />
              <Button color="primary" size="small" onClick={openModal}>
                {t("folderDropzone.updatePrivacySettings")}
              </Button>
            </Typography>
          </Box>
          <Box display="flex">
            <FaEye />
            &nbsp;
            <Typography variant="body1">
              {t("folderDropzone.placeholderSubtitle")}
            </Typography>
          </Box>
        </Grid>
      </FullHeightGrid>
      <SettingsModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </Wrapper>
  );
};

export default FolderDropzone;
