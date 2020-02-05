import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import AuditReportButton, {
  ExportToAuditReport
} from "../buttons/audit-report-button";
import CsvButton, { ExportToCsv } from "../buttons/csv-button";
import MetsButton, { ExportToMets } from "../buttons/mets-button";
import ResipButton, { ExportToResip } from "../buttons/resip-button";
import Button, { ButtonWidth } from "../common/button";
import TextAlignCenter from "../common/text-align-center";
import Bubble from "./dashboard/bubble";
import BubbleCell from "./dashboard/bubble-cell";

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
      comp={
        <TextAlignCenter>
          <Button id="export-menu" width={ButtonWidth.WITH_SPACES}>
            {t("header.export")}
          </Button>
        </TextAlignCenter>
      }
      sub_comp={
        <div className="grid-x">
          <BubbleCell>
            <AuditReportButton
              sessionName={sessionName}
              areHashesReady={areHashesReady}
              exportToAuditReport={exportToAuditReport}
            />
          </BubbleCell>
          <BubbleCell>
            <CsvButton sessionName={sessionName} exportToCsv={exportToCsv} />
          </BubbleCell>
          <BubbleCell>
            <CsvButton
              sessionName={sessionName}
              exportToCsv={exportToCsv}
              areHashesReady={areHashesReady}
              exportWithHashes={true}
            />
          </BubbleCell>
          <BubbleCell>
            <ResipButton
              originalPath={originalPath}
              sessionName={sessionName}
              exportToResip={exportToResip}
            />
          </BubbleCell>
          <BubbleCell>
            <MetsButton
              originalPath={originalPath}
              sessionName={sessionName}
              exportToMets={exportToMets}
            />
          </BubbleCell>
        </div>
      }
    />
  );
};

export default ExportDropdown;
