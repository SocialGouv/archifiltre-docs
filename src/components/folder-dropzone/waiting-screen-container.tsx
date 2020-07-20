import React, { FC } from "react";
import { useSelector } from "react-redux";
import { getLoadingStateFromStore } from "reducers/loading-state/loading-state-selectors";
import WaitingScreen from "components/folder-dropzone/waiting-screen";

type WaitingScreenContainerProps = {
  loadedPath: string;
};

const WaitingScreenContainer: FC<WaitingScreenContainerProps> = ({
  loadedPath,
}) => {
  const {
    fileSystemLoadingStep,
    indexedFilesCount,
    constructedDataModelElementsCount,
    derivedElementsCount,
  } = useSelector(getLoadingStateFromStore);

  return (
    <WaitingScreen
      step={fileSystemLoadingStep}
      indexedFilesCount={indexedFilesCount}
      constructedDataModelElementsCount={constructedDataModelElementsCount}
      derivedElementsCount={derivedElementsCount}
      loadedPath={loadedPath}
    />
  );
};

export default WaitingScreenContainer;
