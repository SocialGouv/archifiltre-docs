import BackToRootButton from "components/buttons/back-to-root-button";
import ToggleWidthBySize from "components/workspace/navigation-bar/toggle-width-by-size";
import React from "react";
import styled from "styled-components";
import { MoveFilesButton } from "../../buttons/move-files-button";
import IciclesSortOrderPicker from "./icicle-sort-order-picker";

const Grid = styled.div`
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
  setIciclesSortMethod
}) => (
  <Grid className="grid-x align-middle">
    <div className="cell small-2">
      <BackToRootButton api={api} />
    </div>
    <div className="cell small-4">
      <div className="flex-container">
        <div className="flex-child-auto">
          <IciclesSortOrderPicker
            iciclesSortMethod={iciclesSortMethod}
            setIciclesSortMethod={setIciclesSortMethod}
          />
        </div>
      </div>
    </div>
    <div className="cell small-4">
      <div className="flex-container">
        <div className="flex-child-auto">
          <ToggleWidthBySize api={api} />
        </div>
      </div>
    </div>
    <div className="cell small-2">
      <MoveFilesButton />
    </div>
  </Grid>
);
