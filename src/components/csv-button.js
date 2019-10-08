import { mkB } from "components/button";

import * as Csv from "csv";
import { save, makeNameWithExt } from "util/file-sys-util";
const label = "CSV";

const CsvButton = props => {
  const api = props.api;
  const database = api.database;
  const getSessionName = database.getSessionName;

  const name = () => makeNameWithExt(getSessionName(), "csv");
  return mkB(
    () => {
      const list = props.exportToCsv(database.getFilesAndFolders());
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
