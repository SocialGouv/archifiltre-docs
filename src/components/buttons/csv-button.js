import { mkB } from "components/buttons/button";

import { makeNameWithExt } from "util/file-sys-util";
const label = "CSV";

const CsvButton = props => {
  const {
    exportToCsv,
    api: { database }
  } = props;
  const name = makeNameWithExt(database.getSessionName(), "csv");

  return mkB(
    () => {
      exportToCsv(name);
    },
    label,
    true,
    "#4d9e25",
    { width: "90%" }
  );
};

export default CsvButton;
