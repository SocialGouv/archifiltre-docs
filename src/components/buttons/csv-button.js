import { mkB } from "components/buttons/button";

import { makeNameWithExt } from "util/file-sys-util";
import { useTranslation } from "react-i18next";

const CsvButton = ({
  api: { database },
  exportToCsv,
  areHashesReady = false,
  exportWithHashes = false
}) => {
  const name = makeNameWithExt(database.getSessionName(), "csv");

  const { t } = useTranslation();
  const buttonLabel = exportWithHashes ? t("header.csvWithHash") : "CSV";
  return mkB(
    () => {
      exportToCsv(name, { withHashes: exportWithHashes });
    },
    buttonLabel,
    !exportWithHashes || areHashesReady,
    "#4d9e25",
    { width: "90%" }
  );
};

export default CsvButton;
