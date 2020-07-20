import React, { FC, useState } from "react";

import { useLoadingStep } from "reducers/loading-state/loading-state-selectors";
import MainSpaceRouter from "./main-space-router";

const MainSpace: FC = () => {
  const [loadedPath, setLoadedPath] = useState("");
  const step = useLoadingStep();

  return (
    <MainSpaceRouter
      step={step}
      loadedPath={loadedPath}
      setLoadedPath={setLoadedPath}
    />
  );
};

export default MainSpace;
