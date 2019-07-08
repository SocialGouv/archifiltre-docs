import React from "react";

import { mkB } from "components/button";

import * as Csv from "csv";
import { save, makeNameWithExt } from "util/file-sys-util";
import { fileAndFoldersToCsv } from "../util/export-util";

const label = "CSV";

const CsvButton = props => {
  const api = props.api;
  const database = api.database;
  const getSessionName = database.getSessionName;

  const name = () => makeNameWithExt(getSessionName(), "csv");
  return mkB(
    async () => {
      const csvStructure = await fileAndFoldersToCsv(
        database.getAllFf(),
        database.getAllTags(),
        database.getOriginalPath()
      );
      save(name(), Csv.toStr(csvStructure));
    },
    label,
    true,
    "#4d9e25",
    { width: "90%" }
  );
};

export default CsvButton;
