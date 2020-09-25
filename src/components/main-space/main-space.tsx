import React, { FC } from "react";

import { useLoadingStep } from "reducers/loading-state/loading-state-selectors";
import MainSpaceRouter from "./main-space-router";

const MainSpace: FC = () => {
  const step = useLoadingStep();

  return <MainSpaceRouter step={step} />;
};

export default MainSpace;
