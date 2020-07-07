import { useTabsState } from "components/header/dashboard/tabs-context";
import React, { FC, useState } from "react";

import Icicle from "components/main-space/icicle/icicle-container";
import NavigationBar from "components/workspace/navigation-bar/navigation-bar-container";
import Box from "@material-ui/core/Box";
import DuplicatesSearch from "../info-boxes/duplicates-search/duplicates-search-container";
import TabsContent from "./tabs/tabs-content";

const workspaceState = {
  isFileMoveActive: false,
  areTabsHidden: false,
  setIsFileMoveActive: (isMoveActive) => {},
  setAreTabsHidden: (areTabsHidden) => {},
};

interface WorkspaceProps {
  api: any;
}

export const WorkspaceContext = React.createContext(workspaceState);

const Workspace: FC<WorkspaceProps> = ({ api }) => {
  const [isFileMoveActive, setIsFileMoveActive] = useState(false);
  const [areTabsHidden, setAreTabsHidden] = useState(false);
  const { areIciclesDisplayed, tabIndex } = useTabsState();

  return (
    <WorkspaceContext.Provider
      value={{
        isFileMoveActive,
        setIsFileMoveActive,
        areTabsHidden,
        setAreTabsHidden,
      }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        <Box
          flexGrow={0}
          flexShrink={0}
          flexBasis="auto"
          style={{ minHeight: "0px", width: "100%" }}
        >
          <Box display="flex" flexDirection="row" flexWrap="wrap" height="100%">
            {!areTabsHidden && <TabsContent api={api} tabIndex={tabIndex} />}
          </Box>
        </Box>
        <Box flexGrow={1} flexShrink={1} flexBasis="auto" overflow="hidden">
          {areIciclesDisplayed ? (
            <Box display="flex" flexDirection="column" height="100%">
              <Box flexGrow={0}>
                <NavigationBar api={api} />
              </Box>
              <Box flexGrow={1} overflow="hidden">
                <Icicle api={api} />
              </Box>
            </Box>
          ) : (
            <DuplicatesSearch />
          )}
        </Box>
      </Box>
    </WorkspaceContext.Provider>
  );
};

export default Workspace;
