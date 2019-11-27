import React from "react";

import FolderDropzone from "components/folder-dropzone/folder-dropzone-container";
import WorkSpace from "components/workspace/workspace-container";
import WaitingScreen from "components/folder-dropzone/waiting-screen";
import ErrorScreen from "components/errors/error-screen";
import Hint from "components/folder-dropzone/hint";
import { hints } from "hints";

const gridStyle = {
  padding: "0em 5em"
};

const MainSpace = props => {
  const { api } = props;
  const { loading_state } = api;

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
          <FolderDropzone api={api} />
        </div>
      </div>
    );
  }
  if (started === true && finished === false) {
    return (
      <div className="grid-y grid-padding-x grid-frame align-center">
        <div className="cell">
          <WaitingScreen api={api} />
        </div>
        <div className="cell shrink">
          <Hint hints={hints} />
        </div>
      </div>
    );
  }
  return (
    <div className="grid-y grid-padding-x grid-frame align-center">
      <div className="cell small-12">
        <WorkSpace api={api} />
      </div>
    </div>
  );
};

export default MainSpace;
