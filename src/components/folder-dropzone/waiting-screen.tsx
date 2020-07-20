import Grid from "@material-ui/core/Grid";
import React, { FC, useMemo } from "react";

import IndexingBlock from "./indexing-block";
import AreaLoadingBar from "../area-components/area-loading-bar";
import { isJsonFile } from "util/file-system/file-sys-util";
import Loader from "./loader";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { FileSystemLoadingStep } from "reducers/loading-state/loading-state-types";

const SimpleLoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SimpleLoaderText = styled.h4`
  padding-right: 15px;
`;

const MainCell = styled.div`
  text-align: center;
`;

interface SimpleLoaderProps {
  loaderText: string;
}

interface TraverseProps {
  indexedFilesCount: number;
  step: FileSystemLoadingStep;
}

interface LoadingMessagesProps {
  step: FileSystemLoadingStep;
  indexedFilesCount: number;
  constructedDataModelElementsCount: number;
  derivedElementsCount: number;
}
interface WaitingScreenProps {
  step: FileSystemLoadingStep;
  indexedFilesCount: number;
  constructedDataModelElementsCount: number;
  derivedElementsCount: number;
  loadedPath: string;
}

const SimpleLoader: FC<SimpleLoaderProps> = ({ loaderText }) => (
  <SimpleLoaderContainer>
    <SimpleLoaderText>{loaderText}</SimpleLoaderText>
    <Loader loading={true} />
  </SimpleLoaderContainer>
);

const LoadingJson: FC = () => {
  const { t } = useTranslation();
  return <SimpleLoader loaderText={t("folderDropzone.jsonLoading")} />;
};

const Traverse: FC<TraverseProps> = ({ indexedFilesCount, step }) => (
  <IndexingBlock
    fileCount={indexedFilesCount}
    loading={step === FileSystemLoadingStep.INDEXING}
  />
);

/**
 * Creates a loader component with the appropriate text
 * @param {Object} translationText - A string of the translation to find
 * @returns {React.Component}
 */
const makeLoadingComponent = (translationText) => ({ count, totalCount }) => {
  const { t } = useTranslation();

  const percentage =
    totalCount > 0 ? Math.min((count / totalCount) * 100, 100) : 0;

  return (
    <AreaLoadingBar progress={percentage}>{t(translationText)}</AreaLoadingBar>
  );
};

const Make = makeLoadingComponent("folderDropzone.constructingDataModel");
const DerivateFF = makeLoadingComponent("folderDropzone.computingDerivedData");

const LoadingMessages: FC<LoadingMessagesProps> = ({
  step,
  indexedFilesCount,
  constructedDataModelElementsCount,
  derivedElementsCount,
}) => {
  const isFileTreeLoaded = step === FileSystemLoadingStep.COMPLETE;
  const { t } = useTranslation();
  return (
    <>
      <Traverse indexedFilesCount={indexedFilesCount} step={step} />
      <Make
        count={constructedDataModelElementsCount}
        totalCount={indexedFilesCount}
      />
      <DerivateFF
        count={derivedElementsCount}
        totalCount={constructedDataModelElementsCount}
      />
      {isFileTreeLoaded && (
        <SimpleLoader loaderText={t("folderDropzone.loadingVisualization")} />
      )}
    </>
  );
};

const WaitingScreen: FC<WaitingScreenProps> = ({
  step,
  indexedFilesCount,
  constructedDataModelElementsCount,
  derivedElementsCount,
  loadedPath,
}) => {
  const isJson = useMemo(() => {
    try {
      return isJsonFile(loadedPath);
    } catch (error) {
      return false;
    }
  }, [loadedPath]);
  return (
    <Grid container direction="column">
      <Grid item>
        <MainCell>
          {isJson ? (
            <LoadingJson />
          ) : (
            <LoadingMessages
              step={step}
              indexedFilesCount={indexedFilesCount}
              constructedDataModelElementsCount={
                constructedDataModelElementsCount
              }
              derivedElementsCount={derivedElementsCount}
            />
          )}
        </MainCell>
      </Grid>
    </Grid>
  );
};

export default WaitingScreen;
