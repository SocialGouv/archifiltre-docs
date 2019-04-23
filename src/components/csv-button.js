import React from "react";

import { mkB } from "components/button";

import * as Csv from "csv";
import { save, makeNameWithExt } from "save";

import pick from "languages";

const label = "CSV";

const CsvButton = props => {
  const api = props.api;
  const database = api.database;
  const getStrList2 = database.toStrList2;
  const getSessionName = database.getSessionName;

  const name = () => makeNameWithExt(getSessionName(), "csv");
  return mkB(
    () => {
      console.log("to csv");
      save(name(), Csv.toStr(getStrList2()));
    },
    label,
    true,
    "#4d9e25",
    { width: "90%" }
  );
};

export default CsvButton;
