import { useCallback, useContext } from "react";
import { WorkspaceContext } from "components/main-space/workspace/workspace";

export const useFileMoveActiveState = () => {
  const { isFileMoveActive, setIsFileMoveActive } = useContext(
    WorkspaceContext
  );
  const setFileMoveActive = useCallback(
    (isMoveActive) => setIsFileMoveActive(isMoveActive),
    [setIsFileMoveActive]
  );
  return { isFileMoveActive, setFileMoveActive };
};
