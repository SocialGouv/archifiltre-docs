import React from "react";

import type { ComponentMap } from "../../hoc/switchComponent";
import { switchComponent } from "../../hoc/switchComponent";
import { LoadingStep } from "../../reducers/loading-state/loading-state-types";
import { ErrorScreen } from "../errors/error-screen";
import { StartScreenContainer as StartScreen } from "../start-screen/start-screen-container";
import { Workspace } from "./workspace/workspace";

interface MainSpaceRouterProps {
    step: LoadingStep;
}

const mainspaceRoutingMap: ComponentMap<MainSpaceRouterProps, LoadingStep> = {
    [LoadingStep.ERROR]: () => <ErrorScreen />,
    [LoadingStep.WAITING]: () => <StartScreen />,
    [LoadingStep.FINISHED]: () => <Workspace />,
};

export const MainSpaceRouter = switchComponent(
    mainspaceRoutingMap,
    ({ step }) => step
);
