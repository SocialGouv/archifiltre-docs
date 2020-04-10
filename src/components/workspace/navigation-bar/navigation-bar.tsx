import Grid from "@material-ui/core/Grid";
import BackToRootButton from "components/buttons/back-to-root-button";
import ToggleWidthBySize from "components/workspace/navigation-bar/toggle-width-by-size";
import React from "react";
import styled from "styled-components";
import { MoveFilesButton } from "../../buttons/move-files-button";
import IciclesSortOrderPicker from "./icicle-sort-order-picker";

const StyledGrid = styled(Grid)`
  background: white;
  border-radius: 5px;
  margin: 0.5em 0;
  max-height: 2.5em;
  min-height: 2.5em;
  padding: 0.2em 1em;
`;

export const NavigationBar = ({
  api,
  iciclesSortMethod,
  setIciclesSortMethod,
}) => (
  <StyledGrid container>
    <Grid item xs={3}>
      <BackToRootButton api={api} />
    </Grid>
    <Grid item xs={3}>
      <MoveFilesButton />
    </Grid>
    <Grid item xs={3}>
      <IciclesSortOrderPicker
        iciclesSortMethod={iciclesSortMethod}
        setIciclesSortMethod={setIciclesSortMethod}
      />
    </Grid>
    <Grid item xs={3}>
      <ToggleWidthBySize api={api} />
    </Grid>
  </StyledGrid>
);
