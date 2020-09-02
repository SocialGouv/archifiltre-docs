import { useCallback, useContext } from "react";
import { WorkspaceContext } from "components/main-space/workspace/workspace";

export const useHideTabsState = () => {
  const { areTabsHidden, setAreTabsHidden } = useContext(WorkspaceContext);
  const setTabsHidden = useCallback(
    (isTabsHidden) => setAreTabsHidden(isTabsHidden),
    [setAreTabsHidden]
  );
  return { areTabsHidden, setTabsHidden };
};
