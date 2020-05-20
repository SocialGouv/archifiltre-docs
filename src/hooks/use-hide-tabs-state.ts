import { useCallback, useContext } from "react";
import { WorkspaceContext } from "components/workspace/workspace";

export const useHideTabsState = () => {
  const { areTabsHidden, setAreTabsHidden } = useContext(WorkspaceContext);
  const setTabsHidden = useCallback(
    (isTabsHidden) => setAreTabsHidden(isTabsHidden),
    [setAreTabsHidden]
  );
  return { areTabsHidden, setTabsHidden };
};
