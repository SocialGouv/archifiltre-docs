import { mkB } from "components/buttons/button";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { makeNameWithExt } from "util/file-sys-util";

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
  return (
    <span
      data-tip={!areHashesReady ? t("header.csvWithHashDisabledMessage") : ""}
      data-for="disabledCSVTooltip"
    >
      {mkB(
        () => {
          exportToAuditReport(name);
        },
        t("header.auditReport"),
        areHashesReady,
        "#4d9e25",
        { width: "90%" }
      )}
    </span>
  );
};

export default AuditReportButton;
