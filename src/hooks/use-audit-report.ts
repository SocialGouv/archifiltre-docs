import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getWorkspaceMetadataFromStore } from "../reducers/workspace-metadata/workspace-metadata-selectors";
import { getNameWithExtension } from "../util/file-sys-util";

export const useAuditReport = ({ areHashesReady, exportToAuditReport }) => {
  const { t } = useTranslation();
  const { sessionName } = useSelector(getWorkspaceMetadataFromStore);
  const name = getNameWithExtension(`${sessionName}-Audit`, "docx");
  const exportFunction = useCallback(() => exportToAuditReport(name), [
    exportToAuditReport,
    name,
  ]);
  return {
    label: t("header.auditReport"),
    exportFunction,
    disabled: !areHashesReady,
    disabledExplanation: t("header.csvWithHashDisabledMessage"),
  };
};
