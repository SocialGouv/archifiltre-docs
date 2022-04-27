import Box from "@material-ui/core/Box";
import React from "react";

import { useTabsState } from "../..//header/tabs-context";
import { HeaderContainer as Header } from "../../header/header-container";
import { DuplicatesSearchContainer as DuplicatesSearch } from "../duplicates-search/duplicates-search-container";
import { HelpButton } from "../help-button";
// eslint-disable-next-line unused-imports/no-unused-imports
import { IcicleApiToProps as Icicle } from "../icicle/icicle-container";
// eslint-disable-next-line unused-imports/no-unused-imports
import { IciclesContainer } from "../icicle/nivo-icicles";
import { NavigationBarContainer as NavigationBar } from "../navigation-bar/navigation-bar-container";
import { TabsContent } from "./tabs/tabs-content";
import { WorkspaceProviders } from "./workspace-providers";

const areIciclesDisplayed = (tabIndex: number) => tabIndex !== 3;

export const Workspace: React.FC = () => {
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
                {/* <Icicle /> */}
                <IciclesContainer />
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
