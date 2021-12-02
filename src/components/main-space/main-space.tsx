import React from "react";

import { useLoadingStep } from "../../reducers/loading-state/loading-state-selectors";
import { MainSpaceRouter } from "./main-space-router";

export const MainSpace: React.FC = () => {
    const step = useLoadingStep();

    return <MainSpaceRouter step={step} />;
};
