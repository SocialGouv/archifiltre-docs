import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import path from "path";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaLock } from "react-icons/fa";
import styled from "styled-components";

import { useModal } from "../../hooks/use-modal";
import { savePreviousSession } from "../../persistence/previous-sessions";
import type { FileSystemLoadingStep } from "../../reducers/loading-state/loading-state-types";
import { StaticImage } from "../common/StaticImage";
import { SettingsModal } from "../modals/settings-modal/settings-modal";
import { Dropzone } from "./dropzone";
import { LoadingBlock } from "./loading-block";
import { StartScreenSidebar } from "./start-screen-sidebar";

declare global {
  const AUTOLOAD: string;
  const AUTORELOAD: string;
}

export interface StartScreenProps {
  loadFromPath: (path: string) => void;
  hasPreviousSession: boolean;
  reloadPreviousSession: () => void;
  isLoading: boolean;
  fileSystemLoadingStep: FileSystemLoadingStep;
  indexedFilesCount: number;
  cancelLoading: () => void;
}

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

export const StartScreen: React.FC<StartScreenProps> = ({
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
    (pathToLoad: string) => {
      loadFromPath(pathToLoad);
      void savePreviousSession(pathToLoad);
    },
    [loadFromPath]
  );

  useEffect(() => {
    if (AUTOLOAD !== "") {
      const pathToLoad = path.resolve(AUTOLOAD);
      loadPath(pathToLoad);
      return;
    }

    // eslint-disable-next-line no-undef -- it's def...
    if (AUTORELOAD !== "") {
      reloadPreviousSession();
    }
  }, [loadPath, reloadPreviousSession]);

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
              <StaticImage
                alt="Logo Archifiltre"
                src={"imgs/logo.png"}
                height={40}
              />
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
