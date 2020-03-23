import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getNameWithExtension } from "util/file-sys-util";
import Button from "../common/button";
import styled from "styled-components";

export type ExportToAuditReport = (name: string) => void;

interface AuditReportButtonProps {
  areHashesReady: boolean;
  sessionName: string;
  exportToAuditReport: ExportToAuditReport;
}

const Wrapper = styled.span`
  width: 100%;
`;

const AuditReportButton: FC<AuditReportButtonProps> = ({
  areHashesReady,
  sessionName,
  exportToAuditReport,
}) => {
  const { t } = useTranslation();
  const name = getNameWithExtension(`${sessionName}-Audit`, "docx");
  const onClick = useCallback(() => exportToAuditReport(name), [
    exportToAuditReport,
    name,
  ]);
  return (
    <Wrapper
      data-tip={!areHashesReady ? t("header.csvWithHashDisabledMessage") : ""}
      data-for="disabledCSVTooltip"
    >
      <Button
        id="audit-report-button"
        onClick={onClick}
        disabled={!areHashesReady}
      >
        {t("header.auditReport")}
      </Button>
    </Wrapper>
  );
};

export default AuditReportButton;
