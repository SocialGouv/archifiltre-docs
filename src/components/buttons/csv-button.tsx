import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import { getNameWithExtension } from "util/file-sys-util";
import Button from "../common/button";

interface ExportToCsvOptions {
  withHashes: boolean;
}

export type ExportToCsv = (name: string, options?: ExportToCsvOptions) => void;

const Wrapper = styled.span`
  width: 100%;
`;

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
  exportWithHashes = false,
}) => {
  const name = getNameWithExtension(sessionName, "csv");
  const { t } = useTranslation();
  const buttonLabel = exportWithHashes ? t("header.csvWithHash") : "CSV";
  const isDisabled = exportWithHashes && !areHashesReady;
  const onClick = useCallback(
    () => exportToCsv(name, { withHashes: exportWithHashes }),
    [exportToCsv, name, exportWithHashes]
  );
  return (
    <Wrapper
      data-tip={isDisabled ? t("header.csvWithHashDisabledMessage") : ""}
      data-for="disabledCSVTooltip"
    >
      <Button id="export-to-csv" onClick={onClick} disabled={isDisabled}>
        {buttonLabel}
      </Button>
      {isDisabled && <ReactTooltip id="disabledCSVTooltip" />}
    </Wrapper>
  );
};

export default CsvButton;
