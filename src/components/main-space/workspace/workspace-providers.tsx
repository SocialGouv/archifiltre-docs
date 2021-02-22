import React, { FC } from "react";
import FileMoveProvider from "./file-move-provider";
import ZoomProvider from "./zoom-provider";

const WorkspaceProviders: FC = ({ children }) => {
  return (
    <FileMoveProvider>
      <ZoomProvider>{children}</ZoomProvider>
    </FileMoveProvider>
  );
};

export default WorkspaceProviders;
