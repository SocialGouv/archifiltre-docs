import React from "react";

import pick from "languages";
import IndexingBlock from "./indexing-block";
import AreaLoadingBar from "../area-components/area-loading-bar";
import { isJsonFile } from "../../util/file-sys-util";
import Loader from "./loader";

const loadingJsonContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const loadingJsonTextStyle = {
  paddingRight: "10px"
};

const LoadingJson = () => {
  const text = pick({
    en: "Json loading",
    fr: "Chargement du json"
  });

  return (
    <div style={loadingJsonContainerStyle}>
      <h3 style={loadingJsonTextStyle}>{text}</h3>
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
 * @param {Object} textMap - A text object with the different languages
 * @returns {React.Component}
 */
const makeLoadingComponent = textMap => {
  const text = pick(textMap);

  const LoadingComponent = ({ count, totalCount, complete, waiting }) => {
    let displayedCount;
    if (waiting === true) {
      displayedCount = 0;
    } else if (complete === true) {
      displayedCount = totalCount;
    } else {
      displayedCount = count;
    }

    const percentage = totalCount ? (displayedCount / totalCount) * 100 : 0;

    return <AreaLoadingBar progress={percentage}>{text}</AreaLoadingBar>;
  };

  return LoadingComponent;
};

const Make = makeLoadingComponent({
  en: "Construction of the data model",
  fr: "Construction du modèle de données"
});

const DerivateFF = makeLoadingComponent({
  en: "Computing derivated data",
  fr: "Calcul des données dérivées"
});

const DivedFF = makeLoadingComponent({
  en: "Computation of file depth",
  fr: "Calcul de la profondeur des fichiers"
});

const cell_style = {
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
      <div style={cell_style}>
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
