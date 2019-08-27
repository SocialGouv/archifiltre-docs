import React from "react";

import { mkB } from "components/button";

import resipExporter from "../exporters/resipExporter";
import { toStr } from "../csv";
import { makeNameWithExt, save } from "../util/file-sys-util";

const label = "RESIP";

const ResipButton = props => {
  const api = props.api;
  const database = api.database;

  const getSessionName = database.getSessionName;
  const name = () => makeNameWithExt(`${getSessionName()}-RESIP`, "csv");
  return mkB(
    () => {
      save(name(), toStr(resipExporter(database.getData())), {
        format: "utf-8"
      });
    },
    label,
    true,
    "#4d9e25",
    { width: "90%" }
  );
};

export default ResipButton;
