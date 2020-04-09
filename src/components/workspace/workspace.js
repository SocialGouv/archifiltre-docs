import React, { useState } from "react";

import Icicle from "components/main-space/icicle/icicle-container";
import Report from "components/report/report-container";
import AllTags from "components/tags/all-tags-container";
import NavigationBar from "components/workspace/navigation-bar/navigation-bar-container";
import { ROOT_FF_ID } from "../../reducers/files-and-folders/files-and-folders-selectors";
import Grid from "@material-ui/core/Grid";

const workspaceMode = {
  isFileMoveActive: false,
  // eslint-disable-next-line no-unused-vars
  setIsFileMoveActive: (isMoveActive) => {},
};

export const WorkspaceContext = React.createContext(workspaceMode);

const Workspace = ({ api }) => (
  <Grid container>
    <Grid container spacing={1}>
      <Grid item xs={10}>
        <Report api={api} />
      </Grid>
      <Grid item xs={2}>
        <AllTags api={api} />
      </Grid>
    </Grid>
    <Grid container>
      <Grid item xs={12}>
        <NavigationBar api={api} />
      </Grid>
      <Grid item xs={12} style={{ height: "100vh" }}>
        <Icicle api={api} />
      </Grid>
    </Grid>
  </Grid>
);

const WorkspaceApiToProps = (props) => {
  const api = props.api;
  const icicle_state = api.icicle_state;

  const childProps = {
    ...props,
    getFfByFfId: props.getFfByFfId,
    display_root: icicle_state.display_root(),
    root_id: ROOT_FF_ID,
    width_by_size: icicle_state.widthBySize(),
  };
  const [isFileMoveActive, setIsFileMoveActive] = useState(false);

  return (
    <WorkspaceContext.Provider
      value={{ isFileMoveActive, setIsFileMoveActive }}
    >
      <Workspace {...childProps} />
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceApiToProps;
