import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";
import { makeNameWithExt } from "util/file-sys-util";
import Button, { ButtonWidth } from "../common/button";

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
  const isDisabled = exportWithHashes && !areHashesReady;
  const onClick = useCallback(
    () => exportToCsv(name, { withHashes: exportWithHashes }),
    [exportToCsv, name, exportWithHashes]
  );
  return (
    <span
      data-tip={isDisabled ? t("header.csvWithHashDisabledMessage") : ""}
      data-for="disabledCSVTooltip"
    >
      <Button
        id="export-to-csv"
        onClick={onClick}
        disabled={isDisabled}
        width={ButtonWidth.WITH_SPACES}
      >
        {buttonLabel}
      </Button>
      {isDisabled && <ReactTooltip id="disabledCSVTooltip" />}
    </span>
  );
};

export default CsvButton;
