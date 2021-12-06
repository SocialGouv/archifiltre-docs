import React from "react";

import { DuplicatePageProvider } from "../../../context/duplicates-page-context";
import { FileMoveProvider } from "./file-move-provider";
import { ZoomProvider } from "./zoom-provider";

export const WorkspaceProviders: React.FC = ({ children }) => {
    return (
        <FileMoveProvider>
            <DuplicatePageProvider>
                <ZoomProvider>{children}</ZoomProvider>
            </DuplicatePageProvider>
        </FileMoveProvider>
    );
};
