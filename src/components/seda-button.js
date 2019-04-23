import React from "react";
// const FS = require('fs')
// const JSZip = require('jszip')

import { mkB } from "components/button";

// import * as Csv from 'csv'
// import { save, makeNameWithExt } from 'save'
// import { recTraverseFileTreeForHook } from 'traverse-file-tree'

import pick from "languages";

const label = "SEDA";

const SedaButton = props => {
  const api = props.api;
  const database = api.database;
  const makeSIP = database.toSIP;
  const getOriginalPath = database.getOriginalPath;

  let button_is_enabled = true;
  if (getOriginalPath() === "") {
    button_is_enabled = false;
  }

  return mkB(
    () => {
      console.log("to SIP");
      makeSIP();
    },
    label,
    button_is_enabled,
    "#4d9e25",
    { width: "90%" }
  );
};

export default SedaButton;
