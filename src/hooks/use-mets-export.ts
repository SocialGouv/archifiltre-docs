import { useCallback } from "react";
import { useSelector } from "react-redux";
import { getWorkspaceMetadataFromStore } from "../reducers/workspace-metadata/workspace-metadata-selectors";

export const useMetsExport = ({ exportToMets }) => {
  const { sessionName, originalPath } = useSelector(
    getWorkspaceMetadataFromStore
  );
  const exportFunction = useCallback(() => {
    exportToMets({
      originalPath,
      sessionName,
    });
  }, [exportToMets, originalPath, sessionName]);

  return {
    label: "METS (beta)",
    exportFunction,
    disabled: originalPath === "",
    disabledExplanation: "",
  };
};
