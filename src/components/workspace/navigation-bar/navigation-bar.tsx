import React from "react";
import Box from "@material-ui/core/Box";
import BackToRootButton from "./back-to-root-button";
import HideTabsButton from "./hide-tabs-button";
import ToggleWidthBySize from "./toggle-width-by-size";
import MoveFilesButton from "./move-files-button";
import IciclesSortOrderPicker from "./icicle-sort-order-picker";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
`;

export const NavigationBar = ({
  api,
  iciclesSortMethod,
  setIciclesSortMethod,
  setNoFocus,
}) => (
  <Wrapper>
    <Box display="flex">
      <Box pt={1} pr={1}>
        <BackToRootButton api={api} setNoFocus={setNoFocus} />
      </Box>
      <Box pt={1} pr={1}>
        <MoveFilesButton />
      </Box>
      <Box pt={1}>
        <HideTabsButton />
      </Box>
      <Box flexGrow={1} />
      <Box p={1}>
        <IciclesSortOrderPicker
          iciclesSortMethod={iciclesSortMethod}
          setIciclesSortMethod={setIciclesSortMethod}
        />
      </Box>
      <Box pt={1}>
        <ToggleWidthBySize api={api} />
      </Box>
    </Box>
  </Wrapper>
);
