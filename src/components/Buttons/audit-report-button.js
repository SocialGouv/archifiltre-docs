import { mkB } from "components/Buttons/button";

import pick from "languages";
import { makeNameWithExt } from "util/file-sys-util";

const label = pick({
  fr: "Rapport d'audit",
  en: "Audit Report"
});

const AuditReportButton = ({
  api: {
    database: { getSessionName }
  },
  exportToAuditReport
}) => {
  const name = makeNameWithExt(`${getSessionName()}-Audit`, "docx");
  return mkB(
    () => {
      exportToAuditReport(name);
    },
    label,
    true,
    "#4d9e25",
    { width: "90%" }
  );
};

export default AuditReportButton;
