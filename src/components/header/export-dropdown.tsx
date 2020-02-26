import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import AuditReportButton, {
  ExportToAuditReport
} from "../buttons/audit-report-button";
import CsvButton, { ExportToCsv } from "../buttons/csv-button";
import MetsButton, { ExportToMets } from "../buttons/mets-button";
import ResipButton, { ExportToResip } from "../buttons/resip-button";
import Button, { ButtonColor, ButtonWidth } from "../common/button";
import Bubble from "./dashboard/bubble";

interface ExportDropdownProps {
  areHashesReady: boolean;
  originalPath: string;
  sessionName: string;
  exportToAuditReport: ExportToAuditReport;
  exportToMets: ExportToMets;
  exportToResip: ExportToResip;
  exportToCsv: ExportToCsv;
}

const ExportDropdown: FC<ExportDropdownProps> = ({
  areHashesReady,
  originalPath,
  sessionName,
  exportToAuditReport,
  exportToCsv,
  exportToMets,
  exportToResip
}) => {
  const { t } = useTranslation();
  return (
    <Bubble
      backgroundColor={ButtonColor.SUCCESS}
      width={ButtonWidth.WITH_SPACES}
      borderRadius="5px"
      comp={
        <Button id="export-menu">
          {t("header.export")}{" "}
          <FaChevronDown style={{ verticalAlign: "top" }} />
        </Button>
      }
      sub_comp={
        <div className="grid-x">
          <AuditReportButton
            sessionName={sessionName}
            areHashesReady={areHashesReady}
            exportToAuditReport={exportToAuditReport}
          />
          <CsvButton sessionName={sessionName} exportToCsv={exportToCsv} />
          <CsvButton
            sessionName={sessionName}
            exportToCsv={exportToCsv}
            areHashesReady={areHashesReady}
            exportWithHashes={true}
          />
          <ResipButton
            originalPath={originalPath}
            sessionName={sessionName}
            exportToResip={exportToResip}
          />
          <MetsButton
            originalPath={originalPath}
            sessionName={sessionName}
            exportToMets={exportToMets}
          />
        </div>
      }
    />
  );
};

export default ExportDropdown;
