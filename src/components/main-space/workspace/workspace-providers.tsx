import DuplicatePageProvider from "context/duplicates-page-context";
import React, { FC } from "react";
import FileMoveProvider from "./file-move-provider";
import ZoomProvider from "./zoom-provider";

const WorkspaceProviders: FC = ({ children }) => {
  return (
    <FileMoveProvider>
      <DuplicatePageProvider>
        <ZoomProvider>{children}</ZoomProvider>
      </DuplicatePageProvider>
    </FileMoveProvider>
  );
};

export default WorkspaceProviders;
