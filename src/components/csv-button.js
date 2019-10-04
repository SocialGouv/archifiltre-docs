import { mkB } from "components/button";

import * as Csv from "csv";
import { save, makeNameWithExt } from "util/file-sys-util";

const label = "CSV";

const CsvButton = props => {
  const api = props.api;
  const database = api.database;
  const getStrList2 = database.toStrList2;
  const getSessionName = database.getSessionName;

  const name = () => makeNameWithExt(getSessionName(), "csv");
  return mkB(
    () => {
      const list = getStrList2();
      const strCsv = Csv.toStr(list);
      save(name(), strCsv, { format: "utf-8" });
    },
    label,
    true,
    "#4d9e25",
    { width: "90%" }
  );
};

export default CsvButton;
