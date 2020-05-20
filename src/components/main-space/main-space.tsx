import React, { FC, useState } from "react";

import FolderDropzone from "components/folder-dropzone/folder-dropzone-container";
import WorkSpace from "components/workspace/workspace";
import WaitingScreen from "components/folder-dropzone/waiting-screen";
import ErrorScreen from "components/errors/error-screen";

interface MainSpaceProps {
  api: any;
}

const MainSpace: FC<MainSpaceProps> = ({ api }) => {
  const { loading_state } = api;
  const [loadedPath, setLoadedPath] = useState("");
  const started = loading_state.isStarted();
  const finished = loading_state.isFinished();
  const error = loading_state.isInError();

  if (error) {
    return <ErrorScreen />;
  }
  if (!started && !finished) {
    return <FolderDropzone api={api} setLoadedPath={setLoadedPath} />;
  }
  if (started && !finished) {
    return <WaitingScreen api={api} loadedPath={loadedPath} />;
  }
  return <WorkSpace api={api} />;
};

export default MainSpace;
