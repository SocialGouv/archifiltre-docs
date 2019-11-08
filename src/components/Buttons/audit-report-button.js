import { mkB } from "components/Buttons/button";

import pick from "languages";
import { saveBlob, makeNameWithExt } from "util/file-sys-util";
import auditReportExporter from "../../exporters/audit/auditReportExporter";

const label = pick({
  fr: "Rapport d'audit",
  en: "Audit Report"
});

const AuditReportButton = props => {
  const api = props.api;
  const database = api.database;

  const getSessionName = database.getSessionName;
  const name = () => makeNameWithExt(`${getSessionName()}-Audit`, "docx");
  return mkB(
    () => {
      saveBlob(name(), auditReportExporter(database.getData()));
    },
    label,
    true,
    "#4d9e25",
    { width: "90%" }
  );
};

export default AuditReportButton;
