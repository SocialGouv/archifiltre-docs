import React, { FC, useState } from "react";

import { useLoadingStep } from "reducers/loading-state/loading-state-selectors";
import MainSpaceRouter from "./main-space-router";

interface MainSpaceProps {
  api: any;
}

const MainSpace: FC<MainSpaceProps> = ({ api }) => {
  const [loadedPath, setLoadedPath] = useState("");
  const step = useLoadingStep();

  return (
    <MainSpaceRouter
      step={step}
      loadedPath={loadedPath}
      setLoadedPath={setLoadedPath}
      api={api}
    />
  );
};

export default MainSpace;
