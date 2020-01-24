import { mkB } from "components/buttons/button";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";
import { makeNameWithExt } from "util/file-sys-util";

interface ExportToCsvOptions {
  withHashes: boolean;
}

export type ExportToCsv = (name: string, options?: ExportToCsvOptions) => void;

interface CsvButtonProps {
  api: any;
  exportToCsv: ExportToCsv;
  areHashesReady?: boolean;
  exportWithHashes?: boolean;
}

const CsvButton: FC<CsvButtonProps> = ({
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
