import { isFalsy, isTruthy } from "@common/utils/string";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import path from "path";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaLock } from "react-icons/fa";
import styled from "styled-components";

import { useModal } from "../../hooks/use-modal";
import { savePreviousSession } from "../../persistence/previous-sessions";
import type { FileSystemLoadingStep } from "../../reducers/loading-state/loading-state-types";
import { Logo } from "../common/Logo";
import { SettingsModal } from "../modals/settings-modal/settings-modal";
import { StartscreenDropzone } from "./startscreen-dropzone";
import { LoadingBlock } from "./loading-block";
import { StartScreenSidebar } from "./start-screen-sidebar";

export interface StartScreenProps {
  cancelLoading: () => void;
  fileSystemLoadingStep: FileSystemLoadingStep;
  hasPreviousSession: boolean;
  indexedFilesCount: number;
  isLoading: boolean;
  loadFromPath: (path: string) => void;
  reloadPreviousSession: () => void;
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
    // cannot test as truthy because var can also be full string
    if (!isFalsy(process.env.AUTOLOAD)) {
      const pathToLoad = path.resolve(process.env.AUTOLOAD);
      loadPath(pathToLoad);
      return;
    }

    if (isTruthy(process.env.AUTORELOAD)) {
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
              <Logo height={40} />
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
            <StartscreenDropzone loadPath={loadPath} setLoadedPath={setLoadedPath} />
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
