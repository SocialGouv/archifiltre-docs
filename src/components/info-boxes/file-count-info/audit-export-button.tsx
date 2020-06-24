import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import React, { FC, useMemo } from "react";
import { FaFileDownload } from "react-icons/fa";
import { useAuditReport } from "hooks/use-audit-report";
import { ExportToAuditReport } from "../../common/export-types";

type AuditExportButtonProps = {
  areHashesReady: boolean;
  exportToAuditReport: ExportToAuditReport;
};

const AuditExportButton: FC<AuditExportButtonProps> = ({
  areHashesReady,
  exportToAuditReport,
}) => {
  const auditExport = useAuditReport({
    areHashesReady,
    exportToAuditReport,
  });

  const tooltipTitle = useMemo(
    () => (auditExport.disabled ? auditExport.disabledExplanation : ""),
    [auditExport]
  );

  return (
    <Tooltip title={tooltipTitle}>
      <span>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={auditExport.exportFunction}
          disabled={auditExport.disabled}
          startIcon={<FaFileDownload />}
        >
          {auditExport.label}
        </Button>
      </span>
    </Tooltip>
  );
};

export default AuditExportButton;
