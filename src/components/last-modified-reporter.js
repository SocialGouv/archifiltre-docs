import React from "react";

import TimeGradient from "components/time-gradient";
import * as ObjectUtil from "util/object-util";

import pick from "languages";

const last_modified_tr = pick({
  en: "Last modified",
  fr: "Dernière modification"
});

const at_tr = pick({
  en: "at",
  fr: "à"
});

const max_tr = pick({
  en: "max"
});

const min_tr = pick({
  en: "min"
});
const average_tr = pick({
  en: "average",
  fr: "moyenne"
});
const median_tr = pick({
  en: "median",
  fr: "médiane"
});

const RedDot = props => {
  return (
    <div
      style={{
        height: "0.5em",
        width: "0.5em",
        backgroundColor: "red",
        borderRadius: "50%",
        margin: "auto"
      }}
    />
  );
};

const BlackCursor = props => {
  return (
    <div
      style={{
        height: "1em",
        width: "0.2em",
        backgroundColor: "black",
        margin: "auto"
      }}
    />
  );
};

const epochTimeToDateTime = d => {
  const res = new Date(d);

  const zeroBasedGetMonth = a => a.getMonth();

  const mm = zeroBasedGetMonth(res) + 1;
  const dd = res.getDate();

  return [
    (dd > 9 ? "" : "0") + dd,
    (mm > 9 ? "" : "0") + mm,
    res.getFullYear()
  ].join("/");
};

const LastModifiedReporter = props => {
  const api = props.api;

  const cursor_width = 0.75;

  let lm_max = "...";
  let lm_median = "...";
  let lm_average = "...";
  let lm_min = "...";

  if (props.placeholder === false) {
    const node = props.getFfByFfId(props.id);

    lm_max = epochTimeToDateTime(node.get("last_modified_max"));
    lm_median = epochTimeToDateTime(node.get("last_modified_median"));
    lm_average = epochTimeToDateTime(node.get("last_modified_average"));
    lm_min = epochTimeToDateTime(node.get("last_modified_min"));
  }

  return (
    <div className="grid-x align-middle">
      <div className="cell small-12">
        <b>{last_modified_tr} :</b>
      </div>

      <div className="cell small-1">
        <BlackCursor />
      </div>
      <div className="cell small-5">{min_tr} :</div>
      <div className="cell small-6">{lm_min}</div>

      <div className="cell small-1">
        <RedDot />
      </div>
      <div className="cell small-5">{average_tr} :</div>
      <div className="cell small-6">{lm_average}</div>

      <div className="cell small-1">
        <BlackCursor />
      </div>
      <div className="cell small-5">{median_tr} :</div>
      <div className="cell small-6">{lm_median}</div>

      <div className="cell small-1">
        <BlackCursor />
      </div>
      <div className="cell small-5">{max_tr} :</div>
      <div className="cell small-6">{lm_max}</div>

      <div className="cell small-12" style={{ paddingTop: "0.5em" }}>
        <TimeGradient api={api} />
      </div>
    </div>
  );
};

export default props => {
  const api = props.api;
  const database = api.database;

  props = ObjectUtil.compose(
    {
      getFfByFfId: database.getFfByFfId
    },
    props
  );

  return <LastModifiedReporter {...props} />;
};
