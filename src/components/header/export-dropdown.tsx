import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { empty } from "../../util/function-util";
import AuditReportButton from "../buttons/audit-report-button";
import { mkB } from "../buttons/button";
import CsvButton from "../buttons/csv-button";
import MetsButton from "../buttons/mets-button";
import ResipButton from "../buttons/resip-button";
import TextAlignCenter from "../common/text-align-center";
import Bubble from "./dashboard/bubble";
import BubbleCell from "./dashboard/bubble-cell";

interface ExportDropdownProps {
  api: any;
  areHashesReady: boolean;
  // tslint:disable-next-line:ban-types
  exportToAuditReport: Function;
  // tslint:disable-next-line:ban-types
  exportToMets: Function;
  // tslint:disable-next-line:ban-types
  exportToResip: Function;
  // tslint:disable-next-line:ban-types
  exportToCsv: Function;
}

const ExportDropdown: FC<ExportDropdownProps> = ({
  api,
  areHashesReady,
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
              api={api}
              areHashesReady={areHashesReady}
              exportToAuditReport={exportToAuditReport}
            />
          </BubbleCell>
          <BubbleCell>
            <CsvButton api={api} exportToCsv={exportToCsv} />
          </BubbleCell>
          <BubbleCell>
            <CsvButton
              api={api}
              exportToCsv={exportToCsv}
              areHashesReady={areHashesReady}
              exportWithHashes={true}
            />
          </BubbleCell>
          <BubbleCell>
            <ResipButton api={api} exportToResip={exportToResip} />
          </BubbleCell>
          <BubbleCell>
            <MetsButton api={api} exportToMets={exportToMets} />
          </BubbleCell>
        </div>
      }
    />
  );
};

export default ExportDropdown;
