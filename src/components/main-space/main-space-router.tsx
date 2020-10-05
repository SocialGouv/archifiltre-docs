import React from "react";
import { LoadingStep } from "reducers/loading-state/loading-state-types";
import StartScreen from "components/start-screen/start-screen-container";
import WorkSpace from "components/main-space/workspace/workspace";
import ErrorScreen from "components/errors/error-screen";
import { ComponentMap, switchComponent } from "hoc/switchComponent";

type MainSpaceRouterProps = {
  step: LoadingStep;
};

const mainspaceRoutingMap: ComponentMap<MainSpaceRouterProps, LoadingStep> = {
  [LoadingStep.ERROR]: () => <ErrorScreen />,
  [LoadingStep.WAITING]: () => <StartScreen />,
  [LoadingStep.FINISHED]: () => <WorkSpace />,
};

const MainSpaceRouter = switchComponent(
  mainspaceRoutingMap,
  ({ step }) => step
);

export default MainSpaceRouter;
