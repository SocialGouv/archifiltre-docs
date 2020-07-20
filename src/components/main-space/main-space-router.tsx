import React from "react";
import { LoadingStep } from "reducers/loading-state/loading-state-types";
import FolderDropzone from "components/folder-dropzone/folder-dropzone-container";
import WorkSpace from "components/workspace/workspace";
import WaitingScreen from "components/folder-dropzone/waiting-screen";
import ErrorScreen from "components/errors/error-screen";
import { ComponentMap, switchComponent } from "../../hoc/switchComponent";

type MainSpaceRouterProps = {
  api: any;
  loadedPath: string;
  setLoadedPath: (path: string) => void;
  step: LoadingStep;
};
const mainspaceRoutingMap: ComponentMap<MainSpaceRouterProps, LoadingStep> = {
  [LoadingStep.ERROR]: () => <ErrorScreen />,
  [LoadingStep.WAITING]: ({ api, setLoadedPath }) => (
    <FolderDropzone api={api} setLoadedPath={setLoadedPath} />
  ),
  [LoadingStep.STARTED]: ({ api, loadedPath }) => (
    <WaitingScreen api={api} loadedPath={loadedPath} />
  ),
  [LoadingStep.FINISHED]: () => <WorkSpace />,
};

const MainSpaceRouter = switchComponent(
  mainspaceRoutingMap,
  ({ step }) => step
);

export default MainSpaceRouter;
