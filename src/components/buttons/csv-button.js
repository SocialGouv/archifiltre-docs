import React from "react";
import ReactTooltip from "react-tooltip";
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
  const isActive = !exportWithHashes || areHashesReady;
  return (
    <span
      data-tip={!isActive ? t("header.csvWithHashDisabledMessage") : ""}
      data-for="disabledCSVTooltip"
    >
      {mkB(
        () => {
          exportToCsv(name, { withHashes: exportWithHashes });
        },
        buttonLabel,
        isActive,
        "#4d9e25",
        { width: "90%" }
      )}
      {!isActive && <ReactTooltip id="disabledCSVTooltip" />}
    </span>
  );
};

export default CsvButton;
