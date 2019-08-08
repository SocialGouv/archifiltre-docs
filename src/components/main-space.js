import React from "react";

import FolderDropzone from "components/folder-dropzone";

import WorkSpace from "components/workspace";

import WaitingScreen from "components/waiting-screen";
import ErrorScreen from "./error-screen";
import Hint from "components/hint";
import { hints } from "hints";

const grid_style = {
  padding: "0em 5em"
};

const MainSpace = props => {
  const api = props.api;
  const loading_state = api.loading_state;

  const started = loading_state.isStarted();
  const finished = loading_state.isFinished();
  const error = loading_state.isInError();

  // return (
  //   <div className="grid-y grid-padding-x grid-frame align-center">
  //     <div className="cell small-8">
  //       <WaitingScreen api={api} />
  //     </div>
  //     <div className="cell shrink">
  //       <Hint hints={hints} />
  //     </div>
  //   </div>
  // ); //////////////////////

  if (error === true) {
    return (
      <div
        className="grid-y grid-padding-x grid-frame align-center"
        style={grid_style}
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
        style={grid_style}
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
        <div className="cell small-8">
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
