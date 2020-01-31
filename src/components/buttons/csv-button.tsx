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
  areHashesReady?: boolean;
  sessionName: string;
  exportToCsv: ExportToCsv;
  exportWithHashes?: boolean;
}

const CsvButton: FC<CsvButtonProps> = ({
  areHashesReady = false,
  sessionName,
  exportToCsv,
  exportWithHashes = false
}) => {
  const name = makeNameWithExt(sessionName, "csv");
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
