import { CircularProgress, Grid } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import LoadingSpinner from "components/start-screen/loading-spinner";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FileSystemLoadingStep } from "reducers/loading-state/loading-state-types";
import styled from "styled-components";
import { isJsonFile } from "util/file-system/file-sys-util";

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

type LoadingBlockProps = {
  fileSystemLoadingStep: FileSystemLoadingStep;
  indexedFilesCount: number;
  loadedPath: string;
  cancelLoading: () => void;
};

const LoadingBlock: FC<LoadingBlockProps> = ({
  fileSystemLoadingStep,
  indexedFilesCount,
  loadedPath,
  cancelLoading,
}) => {
  const { t } = useTranslation();

  const isIndexingDone =
    fileSystemLoadingStep !== FileSystemLoadingStep.INDEXING;

  const loaderText = isJsonFile(loadedPath)
    ? t("startScreen.jsonLoading")
    : `${indexedFilesCount} ${t("startScreen.indexedFiles")}`;

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <StyledGrid item>
        <Box>
          <LoadingSpinner loaderText={loaderText} isLoading={!isIndexingDone} />
          {isIndexingDone && (
            <Box display="flex" justifyContent="center">
              <Box pr={1}>{t("startScreen.almostDone")}</Box>
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
            {t("startScreen.cancelLoading")}
          </Button>
        </Box>
      </StyledGrid>
    </Grid>
  );
};

export default LoadingBlock;
