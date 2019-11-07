import React from "react";

import TimeGradient from "components/time-gradient";

import pick from "languages";
import { epochToFormattedUtcDateString } from "../csv";

const last_modified_tr = pick({
  en: "Last modified",
  fr: "Dernière modification"
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

const RedDot = () => {
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

const BlackCursor = () => {
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

const LastModifiedReporter = ({
  filesAndFoldersId,
  placeholder,
  filesAndFoldersMetadata
}) => {
  let lm_max = "...";
  let lm_median = "...";
  let lm_average = "...";
  let lm_min = "...";

  if (placeholder === false) {
    const metadata = filesAndFoldersMetadata[filesAndFoldersId];
    lm_max = epochToFormattedUtcDateString(metadata.maxLastModified);
    lm_median = epochToFormattedUtcDateString(metadata.medianLastModified);
    lm_average = epochToFormattedUtcDateString(metadata.averageLastModified);
    lm_min = epochToFormattedUtcDateString(metadata.minLastModified);
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
        <TimeGradient
          filesAndFoldersId={filesAndFoldersId}
          filesAndFoldersMetadata={filesAndFoldersMetadata}
        />
      </div>
    </div>
  );
};

export default LastModifiedReporter;
