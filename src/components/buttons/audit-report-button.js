import { mkB } from "components/buttons/button";
import { makeNameWithExt } from "util/file-sys-util";
import { useTranslation } from "react-i18next";

const AuditReportButton = ({
  api: {
    database: { getSessionName }
  },
  exportToAuditReport
}) => {
  const { t } = useTranslation();
  const name = makeNameWithExt(`${getSessionName()}-Audit`, "docx");
  return mkB(
    () => {
      exportToAuditReport(name);
    },
    t("header.auditReport"),
    true,
    "#4d9e25",
    { width: "90%" }
  );
};

export default AuditReportButton;
