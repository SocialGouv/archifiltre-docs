import React, { useState } from "react";

import FolderDropzone from "components/folder-dropzone/folder-dropzone-container";
import WorkSpace from "components/workspace/workspace-container";
import WaitingScreen from "components/folder-dropzone/waiting-screen";
import ErrorScreen from "components/errors/error-screen";
import Hint from "components/folder-dropzone/hint";
import { hints } from "hints";
import styled from "styled-components";

const gridStyle = {
  padding: "0em 5em"
};

const WorkspaceWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const MainSpace = props => {
  const { api } = props;
  const { loading_state } = api;
  const [loadedPath, setLoadedPath] = useState();
  const started = loading_state.isStarted();
  const finished = loading_state.isFinished();
  const error = loading_state.isInError();

  if (error === true) {
    return (
      <div
        className="grid-y grid-padding-x grid-frame align-center"
        style={gridStyle}
      >
        <div className="cell small-8">
          <ErrorScreen api={api} />
        </div>
      </div>
    );
  }
  if (started === false && finished === false) {
    return (
      <div
        className="grid-y grid-padding-x grid-frame align-center"
        style={gridStyle}
      >
        <div className="cell small-8">
          <FolderDropzone api={api} setLoadedPath={setLoadedPath} />
        </div>
      </div>
    );
  }
  if (started === true && finished === false) {
    return (
      <div className="grid-y grid-padding-x grid-frame align-center">
        <div className="cell">
          <WaitingScreen api={api} loadedPath={loadedPath} />
        </div>
        <div className="cell shrink">
          <Hint hints={hints} />
        </div>
      </div>
    );
  }
  return (
    <div className="grid-y grid-padding-x grid-frame align-center">
      <WorkspaceWrapper>
        <WorkSpace api={api} />
      </WorkspaceWrapper>
    </div>
  );
};

export default MainSpace;
