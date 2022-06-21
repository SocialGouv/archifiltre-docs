import type { FC } from "react";
import React, { lazy, Suspense } from "react";

import { LoadingStep } from "../../reducers/loading-state/loading-state-types";
import { ErrorScreen } from "../errors/error-screen";
import { StartScreenContainer as StartScreen } from "../start-screen/start-screen-container";

export interface MainSpaceRouterProps {
  step: LoadingStep;
}

const LazyWorkspace = lazy(async () => import("./workspace/workspace"));

export const MainSpaceRouter: FC<{ step: LoadingStep }> = ({ step }) => {
  if (step === LoadingStep.ERROR) {
    return <ErrorScreen />;
  }
  if (step === LoadingStep.WAITING) {
    return <StartScreen />;
  }
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <LazyWorkspace />
    </Suspense>
  );
};
