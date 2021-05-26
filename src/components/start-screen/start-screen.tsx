import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Dropzone from "components/start-screen/dropzone";
import LoadingBlock from "components/start-screen/loading-block";
import StartScreenSidebar from "components/start-screen/start-screen-sidebar";
import SettingsModal from "components/modals/settings-modal/settings-modal";
import { useModal } from "hooks/use-modal";
import { savePreviousSession } from "persistence/previous-sessions";
import React, { FC, useCallback, useEffect, useState } from "react";
import path from "path";
import { FaEye, FaLock } from "react-icons/fa";
import { FileSystemLoadingStep } from "reducers/loading-state/loading-state-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import logo from "../../../static/imgs/logo.png";

declare global {
  const AUTOLOAD: string;
  const AUTORELOAD: string;
}

type StartScreenProps = {
  loadFromPath: (path: string) => void;
  hasPreviousSession: boolean;
  reloadPreviousSession: () => void;
  isLoading: boolean;
  fileSystemLoadingStep: FileSystemLoadingStep;
  indexedFilesCount: number;
  cancelLoading: () => void;
};

const DropzoneWrapper = styled(Grid)`
  flex: 1;
  display: flex;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const FullHeightGrid = styled(Grid)`
  height: 100%;
`;

const StartScreen: FC<StartScreenProps> = ({
  loadFromPath,
  hasPreviousSession,
  reloadPreviousSession,
  isLoading,
  fileSystemLoadingStep,
  indexedFilesCount,
  cancelLoading,
}) => {
  const { t } = useTranslation();
  const { isModalOpen, openModal, closeModal } = useModal();
  const [loadedPath, setLoadedPath] = useState("");

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
      return;
    }

    if (AUTORELOAD !== "") {
      reloadPreviousSession();
    }
  }, []);

  return (
    <Wrapper>
      <StartScreenSidebar
        hasPreviousSession={hasPreviousSession}
        reloadPreviousSession={reloadPreviousSession}
        openModal={openModal}
        loadPath={loadPath}
        isLoading={isLoading}
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
          {isLoading ? (
            <LoadingBlock
              fileSystemLoadingStep={fileSystemLoadingStep}
              indexedFilesCount={indexedFilesCount}
              loadedPath={loadedPath}
              cancelLoading={cancelLoading}
            />
          ) : (
            <Dropzone loadPath={loadPath} setLoadedPath={setLoadedPath} />
          )}
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

export default StartScreen;
