import { useTabsState } from "components/header/tabs-context";
import React, { FC, useState } from "react";

import Icicle from "components/main-space/icicle/icicle-container";
import NavigationBar from "components/main-space/navigation-bar/navigation-bar-container";
import Box from "@material-ui/core/Box";
import DuplicatesSearch from "components/main-space/duplicates-search/duplicates-search-container";
import TabsContent from "./tabs/tabs-content";

import Header from "components/header/header-container";

const workspaceState = {
  isFileMoveActive: false,
  areTabsHidden: false,
  setIsFileMoveActive: (isMoveActive) => {},
  setAreTabsHidden: (areTabsHidden) => {},
};

export const WorkspaceContext = React.createContext(workspaceState);

const Workspace: FC = () => {
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
        <Header />
        <Box
          flexGrow={0}
          flexShrink={0}
          flexBasis="auto"
          style={{ minHeight: "0px", width: "100%" }}
        >
          <Box display="flex" flexDirection="row" flexWrap="wrap" height="100%">
            {!areTabsHidden && <TabsContent tabIndex={tabIndex} />}
          </Box>
        </Box>
        <Box flexGrow={1} flexShrink={1} flexBasis="auto" overflow="hidden">
          {areIciclesDisplayed ? (
            <Box display="flex" flexDirection="column" height="100%">
              <Box flexGrow={0}>
                <NavigationBar />
              </Box>
              <Box flexGrow={1} overflow="hidden">
                <Icicle />
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
