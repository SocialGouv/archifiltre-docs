import { mkB } from "components/button";

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
      save(
        name(),
        toStr(props.exportToResip(database.getData().files_and_folders))
      );
    },
    label,
    true,
    "#4d9e25",
    { width: "90%" }
  );
};

export default ResipButton;
