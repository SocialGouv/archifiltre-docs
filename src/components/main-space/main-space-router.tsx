import ErrorScreen from "components/errors/error-screen";
import WorkSpace from "components/main-space/workspace/workspace";
import StartScreen from "components/start-screen/start-screen-container";
import type { ComponentMap } from "hoc/switchComponent";
import { switchComponent } from "hoc/switchComponent";
import React from "react";
import { LoadingStep } from "reducers/loading-state/loading-state-types";

interface MainSpaceRouterProps {
    step: LoadingStep;
}

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
