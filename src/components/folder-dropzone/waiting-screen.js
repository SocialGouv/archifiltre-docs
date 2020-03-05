import React from "react";

import IndexingBlock from "./indexing-block";
import AreaLoadingBar from "../area-components/area-loading-bar";
import { isJsonFile } from "../../util/file-sys-util";
import Loader from "./loader";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

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

const SimpleLoader = ({ loaderText }) => (
  <SimpleLoaderContainer>
    <SimpleLoaderText>{loaderText}</SimpleLoaderText>
    <Loader loading={true} />
  </SimpleLoaderContainer>
);

const LoadingJson = () => {
  const { t } = useTranslation();
  return <SimpleLoader loaderText={t("folderDropzone.jsonLoading")} />;
};

const Traverse = ({ count, complete, totalCount }) => (
  <IndexingBlock
    fileCount={!complete ? count : totalCount}
    loading={!complete}
  />
);

/**
 * Creates a loader component with the appropriate text
 * @param {Object} translationText - A string of the translation to find
 * @returns {React.Component}
 */
const makeLoadingComponent = translationText => ({
  count,
  totalCount,
  complete,
  waiting
}) => {
  const { t } = useTranslation();
  let displayedCount;
  if (waiting === true) {
    displayedCount = 0;
  } else if (complete === true) {
    displayedCount = totalCount;
  } else {
    displayedCount = count;
  }

  const percentage = totalCount ? (displayedCount / totalCount) * 100 : 0;

  return (
    <AreaLoadingBar progress={percentage}>{t(translationText)}</AreaLoadingBar>
  );
};

const Make = makeLoadingComponent("folderDropzone.constructingDataModel");
const DerivateFF = makeLoadingComponent("folderDropzone.computingDerivedData");
const DivedFF = makeLoadingComponent("folderDropzone.computingFileDepth");

const statusMap = {
  traverse: 0,
  make: 1,
  derivateFF: 2,
  divedFF: 3
};

const statusComponents = [
  {
    index: statusMap.traverse,
    Component: Traverse
  },
  {
    index: statusMap.make,
    Component: Make
  },
  {
    index: statusMap.derivateFF,
    Component: DerivateFF
  },
  {
    index: statusMap.divedFF,
    Component: DivedFF
  }
];

const LoadingMessages = ({ status, count, totalCount }) => {
  const currentStatusIndex = statusMap[status];
  const lastStatusComponent = statusComponents.slice(-1)[0];
  const isFileTreeLoaded = currentStatusIndex >= lastStatusComponent.index;
  const { t } = useTranslation();
  return (
    <>
      {statusComponents.map(({ index, Component }) => (
        <Component
          key={index}
          count={count}
          totalCount={totalCount}
          complete={currentStatusIndex > index}
          waiting={currentStatusIndex < index}
        />
      ))}
      {isFileTreeLoaded && (
        <SimpleLoader loaderText={t("folderDropzone.loadingVisualization")} />
      )}
    </>
  );
};

const Presentational = ({ status, count, totalCount, loadedPath }) => (
  <div className="grid-y grid-frame align-center">
    <div className="cell">
      <MainCell>
        {isJsonFile(loadedPath) ? (
          <LoadingJson />
        ) : (
          <LoadingMessages
            status={status}
            count={count}
            totalCount={totalCount}
          />
        )}
      </MainCell>
    </div>
  </div>
);

const WaitingScreen = ({
  loadedPath,
  api: {
    loading_state: { status, count, totalCount }
  }
}) => (
  <Presentational
    status={status()}
    count={count()}
    totalCount={totalCount()}
    loadedPath={loadedPath}
  />
);

export default WaitingScreen;
