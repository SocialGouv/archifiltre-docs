import { useTabsState } from "components/header/tabs-context";
import React, { FC } from "react";

import NavigationBar from "components/main-space/navigation-bar/navigation-bar-container";
import Box from "@material-ui/core/Box";
import DuplicatesSearch from "components/main-space/duplicates-search/duplicates-search-container";
import TabsContent from "./tabs/tabs-content";

import Header from "components/header/header-container";
import WorkspaceProviders from "./workspace-providers";
import HelpButton from "../help-button";
import Icicles from "../new-icicle/icicles-container";

const areIciclesDisplayed = (tabIndex: number) => tabIndex !== 3;

const Workspace: FC = () => {
  const { tabIndex } = useTabsState();

  return (
    <WorkspaceProviders>
      <Box display="flex" flexDirection="column" height="100%">
        <Header />
        <Box
          flexGrow={0}
          flexShrink={0}
          flexBasis="auto"
          style={{ minHeight: "0px", width: "100%" }}
        >
          <Box display="flex" flexDirection="row" flexWrap="wrap" height="100%">
            <TabsContent tabIndex={tabIndex} />
          </Box>
        </Box>
        <Box flexGrow={1} flexShrink={1} flexBasis="auto" overflow="hidden">
          {areIciclesDisplayed(tabIndex) ? (
            <Box display="flex" flexDirection="column" height="100%">
              <Box flexGrow={0}>
                <NavigationBar />
              </Box>
              <Box flexGrow={1} overflow="hidden">
                {/*<Icicle/>*/}
                <Icicles />
              </Box>
              <Box position="absolute" bottom={15} right={15}>
                <HelpButton />
              </Box>
            </Box>
          ) : (
            <DuplicatesSearch />
          )}
        </Box>
      </Box>
    </WorkspaceProviders>
  );
};

export default Workspace;
