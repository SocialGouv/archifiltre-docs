import Box from "@material-ui/core/Box";
import React from "react";

import { useTabsState } from "../../header/tabs-context";
import { HeaderContainer as Header } from "../../header/header-container";
import { DuplicatesSearchContainer as DuplicatesSearch } from "../duplicates-search/duplicates-search-container";
import { HelpButton } from "../help-button";
import type { IcicleContainerProps } from "../icicle/icicle-container";
import { IcicleContainer as Icicle } from "../icicle/icicle-container";
import { IcicleMetadataSidebarContainer } from "../icicle/icicle-metadata/icicle-metadata-sidebar-container";
import { NavigationBarContainer as NavigationBar } from "../navigation-bar/navigation-bar-container";
import {
  DUPLICATES_TAB_INDEX,
  ENRICHMENT_TAB_INDEX,
} from "./tabs/tabs-constants";
import { TabsContent } from "./tabs/tabs-content";
import { WorkspaceProviders } from "./workspace-providers";

const areIciclesDisplayed = (tabIndex: number) =>
  tabIndex !== DUPLICATES_TAB_INDEX;

const minimapReplaceComponent = (
  tabIndex: number
): IcicleContainerProps["rightSidebar"] | undefined =>
  ({
    [ENRICHMENT_TAB_INDEX]: IcicleMetadataSidebarContainer,
  }[tabIndex]);

const Workspace: React.FC = () => {
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
                <Icicle rightSidebar={minimapReplaceComponent(tabIndex)} />
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
