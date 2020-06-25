import React, { FC, useState } from "react";

import FolderDropzone from "components/folder-dropzone/folder-dropzone-container";
import WorkSpace from "components/workspace/workspace";
import WaitingScreen from "components/folder-dropzone/waiting-screen";
import ErrorScreen from "components/errors/error-screen";
import { useLoadingStep } from "../../reducers/loading-state/loading-state-selectors";
import { LoadingStep } from "../../reducers/loading-state/loading-state-types";

interface MainSpaceProps {
  api: any;
}

const MainSpace: FC<MainSpaceProps> = ({ api }) => {
  const [loadedPath, setLoadedPath] = useState("");
  const step = useLoadingStep();

  if (step === LoadingStep.ERROR) {
    return <ErrorScreen />;
  }
  if (step === LoadingStep.WAITING) {
    return <FolderDropzone api={api} setLoadedPath={setLoadedPath} />;
  }
  if (step === LoadingStep.STARTED) {
    return <WaitingScreen api={api} loadedPath={loadedPath} />;
  }
  return <WorkSpace api={api} />;
};

export default MainSpace;
