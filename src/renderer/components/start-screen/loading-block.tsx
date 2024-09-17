import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import type { FileSystemLoadingStep } from "../../reducers/loading-state/loading-state-types";
import { isJsonFile } from "../../utils/file-system/file-sys-util";
import LoadingDots from "../loading/loading-dots/dot-progress";
import { LoadingSpinner } from "./loading-spinner";

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export interface LoadingBlockProps {
  cancelLoading: () => void;
  fileSystemLoadingStep: FileSystemLoadingStep;
  folderName: string;
  indexedFilesCount: number;
  loadedPath: string;
}

export const LoadingBlock: React.FC<LoadingBlockProps> = ({
  fileSystemLoadingStep,
  indexedFilesCount,
  loadedPath,
  folderName,
  cancelLoading,
}) => {
  const { t } = useTranslation();

  const loaderText = isJsonFile(loadedPath)
    ? t("folderDropzone.jsonLoading")
    : `${indexedFilesCount} ${t("folderDropzone.indexedFiles")}`;

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <StyledGrid item>
        <Box textAlign="center">
          <Typography variant="h6">
            {t("folderDropzone.loadingFolder")}:
          </Typography>
          <Typography variant="h4" color="textPrimary">
            {folderName}
          </Typography>
        </Box>
        <Box mt={3}>
          <LoadingSpinner loaderText={loaderText} isLoading={true} />
          <Box display="flex" justifyContent="center">
            <Box pr={1}>
              {t(`fileSystemLoadingStep.${fileSystemLoadingStep}`)}
            </Box>
            <LoadingDots />
          </Box>
        </Box>
        <Box p={2}>
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={cancelLoading}
          >
            {t("folderDropzone.cancelLoading")}
          </Button>
        </Box>
      </StyledGrid>
    </Grid>
  );
};
