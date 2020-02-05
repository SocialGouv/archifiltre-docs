import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { makeNameWithExt } from "util/file-sys-util";
import Button, { ButtonWidth } from "../common/button";

export type ExportToAuditReport = (name: string) => void;

interface AuditReportButtonProps {
  areHashesReady: boolean;
  sessionName: string;
  exportToAuditReport: ExportToAuditReport;
}

const AuditReportButton: FC<AuditReportButtonProps> = ({
  areHashesReady,
  sessionName,
  exportToAuditReport
}) => {
  const { t } = useTranslation();
  const name = makeNameWithExt(`${sessionName}-Audit`, "docx");
  const onClick = useCallback(() => exportToAuditReport(name), [
    exportToAuditReport,
    name
  ]);
  return (
    <span
      data-tip={!areHashesReady ? t("header.csvWithHashDisabledMessage") : ""}
      data-for="disabledCSVTooltip"
    >
      <Button
        id="audit-report-button"
        onClick={onClick}
        disabled={!areHashesReady}
        width={ButtonWidth.WITH_SPACES}
      >
        {t("header.auditReport")}
      </Button>
    </span>
  );
};

export default AuditReportButton;
