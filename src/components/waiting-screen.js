import React from "react";

import * as ObjectUtil from "util/object-util";
import pick from "languages";
import ProgressBar from "./progress-bar";

const Loading = () => {
  const text = pick({
    en: "Json loading",
    fr: "Chargement du json"
  });

  return <p>{text}</p>;
};

const Traverse = ({ count, totalCount, complete }) => {
  const text = pick({
    en: "Files loaded",
    fr: "Fichiers chargés"
  });

  return (
    <div>
      {text}: {complete ? totalCount : count}
    </div>
  );
};

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

    return (
      <div>
        {text} : <ProgressBar percentage={percentage} />
      </div>
    );
  };

  return LoadingComponent;
};

const Make = makeLoadingComponent({
  en: "Construction of the data model",
  fr: "Construction du modèle de données"
});

const DerivateFF = makeLoadingComponent({
  en: "Computation of the derivative data from file and folders",
  fr: "Calcul des données dérivées des fichiers et dossiers"
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

const Presentational = ({ status, count, totalCount }) => (
  <div className="grid-y grid-frame align-center">
    <div className="cell">
      <div style={cell_style}>
        <img
          alt="loading"
          src="imgs/loading.gif"
          style={{ width: "50%", opacity: "0.3" }}
        />
        {status === "loading" && <Loading />}
        <LoadingMessages
          status={status}
          count={count}
          totalCount={totalCount}
        />
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
