import React from "react";

import IndexingBlock from "./indexing-block";
import AreaLoadingBar from "../area-components/area-loading-bar";
import { isJsonFile } from "../../util/file-sys-util";
import Loader from "./loader";
import { useTranslation } from "react-i18next";

const loadingJsonContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const loadingJsonTextStyle = {
  paddingRight: "10px"
};

const LoadingJson = () => {
  const { t } = useTranslation();
  return (
    <div style={loadingJsonContainerStyle}>
      <h3 style={loadingJsonTextStyle}>{t("folderDropzone.jsonLoading")}</h3>
      <Loader loading={true} />
    </div>
  );
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

const cellStyle = {
  textAlign: "center"
};

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

  return (
    <React.Fragment>
      {statusComponents.map(({ index, Component }) => (
        <Component
          key={index}
          count={count}
          totalCount={totalCount}
          complete={currentStatusIndex > index}
          waiting={currentStatusIndex < index}
        />
      ))}
    </React.Fragment>
  );
};

const Presentational = ({ status, count, totalCount, loadedPath }) => (
  <div className="grid-y grid-frame align-center">
    <div className="cell">
      <div style={cellStyle}>
        {isJsonFile(loadedPath) ? (
          <LoadingJson />
        ) : (
          <LoadingMessages
            status={status}
            count={count}
            totalCount={totalCount}
          />
        )}
      </div>
    </div>
  </div>
);

const WaitingScreen = props => {
  const {
    api: { loading_state }
  } = props;
  const status = loading_state.status();
  const count = loading_state.count();
  const totalCount = loading_state.totalCount();
  return (
    <Presentational
      {...props}
      status={status}
      count={count}
      totalCount={totalCount}
    />
  );
};

export default WaitingScreen;
