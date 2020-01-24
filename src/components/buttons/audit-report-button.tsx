import { mkB } from "components/buttons/button";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { makeNameWithExt } from "util/file-sys-util";

export type ExportToAuditReport = (name: string) => void;

interface AuditReportButtonProps {
  api: any;
  areHashesReady: boolean;
  exportToAuditReport: ExportToAuditReport;
}

const AuditReportButton: FC<AuditReportButtonProps> = ({
  api: {
    database: { getSessionName }
  },
  areHashesReady,
  exportToAuditReport
}) => {
  const { t } = useTranslation();
  const name = makeNameWithExt(`${getSessionName()}-Audit`, "docx");
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
