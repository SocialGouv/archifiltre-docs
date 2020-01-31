import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { empty } from "../../util/function-util";
import AuditReportButton, {
  ExportToAuditReport
} from "../buttons/audit-report-button";
import { mkB } from "../buttons/button";
import CsvButton, { ExportToCsv } from "../buttons/csv-button";
import MetsButton, { ExportToMets } from "../buttons/mets-button";
import ResipButton, { ExportToResip } from "../buttons/resip-button";
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
          {mkB(
            empty,
            t("header.export"),
            true,
            "#4d9e25",
            { width: "90%", cursor: "default" },
            "export-menu"
          )}
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
