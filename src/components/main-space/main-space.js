import React, { useState } from "react";

import FolderDropzone from "components/folder-dropzone/folder-dropzone-container";
import WorkSpace from "components/workspace/workspace-container";
import WaitingScreen from "components/folder-dropzone/waiting-screen";
import ErrorScreen from "components/errors/error-screen";
import { Grid } from "@material-ui/core";

const MainSpace = (props) => {
  const { api } = props;
  const { loading_state } = api;
  const [loadedPath, setLoadedPath] = useState();
  const started = loading_state.isStarted();
  const finished = loading_state.isFinished();
  const error = loading_state.isInError();

  if (error === true) {
    return (
      <Grid>
        <ErrorScreen api={api} />
      </Grid>
    );
  }
  if (started === false && finished === false) {
    return (
      <Grid container>
        <FolderDropzone api={api} setLoadedPath={setLoadedPath} />
      </Grid>
    );
  }
  if (started === true && finished === false) {
    return (
      <Grid>
        <WaitingScreen api={api} loadedPath={loadedPath} />
      </Grid>
    );
  }
  return (
    <Grid container>
      <WorkSpace api={api} />
    </Grid>
  );
};

export default MainSpace;
