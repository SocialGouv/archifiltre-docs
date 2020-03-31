import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getWorkspaceMetadataFromStore } from "../reducers/workspace-metadata/workspace-metadata-selectors";
import { getNameWithExtension } from "../util/file-sys-util";

export const useCsvExport = ({
  exportToCsv,
  areHashesReady = false,
  exportWithHashes = false,
}) => {
  const { t } = useTranslation();
  const { sessionName } = useSelector(getWorkspaceMetadataFromStore);
  const name = getNameWithExtension(sessionName, "csv");
  const buttonLabel = exportWithHashes ? t("header.csvWithHash") : "CSV";
  const isDisabled = exportWithHashes && !areHashesReady;
  const exportFunction = useCallback(
    () => exportToCsv(name, { withHashes: exportWithHashes }),
    [exportToCsv, name, exportWithHashes]
  );
  return {
    label: buttonLabel,
    exportFunction,
    disabled: isDisabled,
    disabledExplanation: t("header.csvWithHashDisabledMessage"),
  };
};
