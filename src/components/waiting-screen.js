import React from "react";

import * as ObjectUtil from "util/object-util";
import pick from "languages";

const Loading = () => {
  const text = pick({
    en: "Json loading",
    fr: "Chargement du json"
  });

  return <p>{text}</p>;
};

const Traverse = props => {
  const count = props.count;
  const text = pick({
    en: "Files loaded",
    fr: "Fichiers chargés"
  });

  return (
    <p>
      {text}: {count}
    </p>
  );
};

const Make = () => {
  const text = pick({
    en: "Construction of the data model",
    fr: "Construction du model de donnée"
  });

  return <p>{text}</p>;
};

const Derivate = () => {
  const text = pick({
    en: "Computation of the derivative data",
    fr: "Calcul des données dérivées"
  });

  return <p>{text}</p>;
};

const cell_style = {
  textAlign: "center"
};

class Presentational extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    const status = props.status;
    const count = props.count;

    return (
      <div className="grid-y grid-frame align-center">
        <div className="cell">
          <div style={cell_style}>
            <img
              alt="loading"
              src="imgs/loading.gif"
              style={{ width: "50%", opacity: "0.3" }}
            />
            {status === "loading" && <Loading />}
            {status === "traverse" && <Traverse count={count} />}
            {status === "make" && <Make />}
            {status === "derivate" && <Derivate />}
          </div>
        </div>
      </div>
    );
  }
}

export default props => {
  const api = props.api;

  const loading_state = api.loading_state;
  const status = loading_state.status();
  const count = loading_state.count();

  props = ObjectUtil.compose(
    {
      status,
      count
    },
    props
  );

  return <Presentational {...props} />;
};
