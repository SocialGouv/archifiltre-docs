import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { FileSystemLoadingStep } from "../../reducers/loading-state/loading-state-types";
import { isJsonFile } from "../../utils/file-system/file-sys-util";
import { LoadingSpinner } from "./loading-spinner";

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export interface LoadingBlockProps {
  fileSystemLoadingStep: FileSystemLoadingStep;
  indexedFilesCount: number;
  loadedPath: string;
  cancelLoading: () => void;
}

export const LoadingBlock: React.FC<LoadingBlockProps> = ({
  fileSystemLoadingStep,
  indexedFilesCount,
  loadedPath,
  cancelLoading,
}) => {
  const { t } = useTranslation();

  const isIndexingDone =
    fileSystemLoadingStep !== FileSystemLoadingStep.INDEXING;

  const loaderText = isJsonFile(loadedPath)
    ? t("folderDropzone.jsonLoading")
    : `${indexedFilesCount} ${t("folderDropzone.indexedFiles")}`;

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <StyledGrid item>
        <Box>
          <LoadingSpinner loaderText={loaderText} isLoading={!isIndexingDone} />
          {isIndexingDone && (
            <Box display="flex" justifyContent="center">
              <Box pr={1}>{t("folderDropzone.almostDone")}</Box>
              <CircularProgress size={12} style={{ alignSelf: "center" }} />
            </Box>
          )}
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
