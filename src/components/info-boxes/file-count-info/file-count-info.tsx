import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@material-ui/core";
import CategoryTitle from "../../common/category-title";
import { ExportToAuditReport } from "../../common/export-types";
import LargeIndicatorText from "../common/large-indicator-text";
import InfoBoxPaper from "../common/info-box-paper";
import AuditExportButton from "./audit-export-button";

interface FileCountInfoProps {
  fileCount: number;
  areHashesReady: boolean;
  exportToAuditReport: ExportToAuditReport;
}

const FileCountInfo: FC<FileCountInfoProps> = ({
  fileCount,
  areHashesReady,
  exportToAuditReport,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <CategoryTitle>{t("audit.fileCountInfoTitle")}</CategoryTitle>
        <AuditExportButton
          areHashesReady={areHashesReady}
          exportToAuditReport={exportToAuditReport}
        />
      </Box>
      <Box>
        <InfoBoxPaper>
          <LargeIndicatorText>{fileCount}</LargeIndicatorText>
        </InfoBoxPaper>
      </Box>
    </Box>
  );
};

export default FileCountInfo;
