import path from "path";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { getWorkspaceMetadataFromStore } from "../reducers/workspace-metadata/workspace-metadata-selectors";
import { getNameWithExtension } from "../util/file-sys-util";

export const useResipExport = ({ exportToResip }) => {
  const { sessionName, originalPath } = useSelector(
    getWorkspaceMetadataFromStore
  );
  const savePath = path.join(originalPath, `${sessionName}-RESIP`);
  const name = getNameWithExtension(savePath, "csv");
  const exportFunction = useCallback(() => {
    exportToResip(name);
  }, [exportToResip, name]);
  return {
    label: "RESIP",
    exportFunction,
    disabled: false,
    disabledExplanation: "",
  };
};
