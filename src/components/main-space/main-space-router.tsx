import React from "react";
import { LoadingStep } from "reducers/loading-state/loading-state-types";
import FolderDropzone from "components/folder-dropzone/folder-dropzone-container";
import WorkSpace from "components/workspace/workspace";
import ErrorScreen from "components/errors/error-screen";
import { ComponentMap, switchComponent } from "../../hoc/switchComponent";
import WaitingScreenContainer from "components/folder-dropzone/waiting-screen-container";

type MainSpaceRouterProps = {
  loadedPath: string;
  setLoadedPath: (path: string) => void;
  step: LoadingStep;
};
const mainspaceRoutingMap: ComponentMap<MainSpaceRouterProps, LoadingStep> = {
  [LoadingStep.ERROR]: () => <ErrorScreen />,
  [LoadingStep.WAITING]: ({ setLoadedPath }) => (
    <FolderDropzone setLoadedPath={setLoadedPath} />
  ),
  [LoadingStep.STARTED]: ({ loadedPath }) => (
    <WaitingScreenContainer loadedPath={loadedPath} />
  ),
  [LoadingStep.FINISHED]: () => <WorkSpace />,
};

const MainSpaceRouter = switchComponent(
  mainspaceRoutingMap,
  ({ step }) => step
);

export default MainSpaceRouter;
