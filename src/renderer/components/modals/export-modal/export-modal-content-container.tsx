import type { ExportType } from "@common/export/type";
import { getTrackerProvider } from "@common/modules/tracker";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAreHashesReady } from "../../../reducers/files-and-folders/files-and-folders-selectors";
import { getWorkspaceMetadataFromStore } from "../../../reducers/workspace-metadata/workspace-metadata-selectors";
import { exportConfig } from "./export-config";
import { ExportModalContent } from "./export-modal-content";

export interface ExportModalContentContainerProps {
  closeModal: () => void;
}

export const ExportModalContentContainer: React.FC<
  ExportModalContentContainerProps
> = ({ closeModal }) => {
  const { originalPath, sessionName } = useSelector(
    getWorkspaceMetadataFromStore
  );
  const areHashesReady = useSelector(getAreHashesReady);

  const dispatch = useDispatch();

  const startExport = (exportId: ExportType, exportPath: string) => {
    const { exportFunction } = exportConfig[exportId];
    getTrackerProvider().track("Export Generated", {
      type: exportId,
    });
    dispatch(exportFunction(exportPath));
  };

  return (
    <ExportModalContent
      areHashesReady={areHashesReady}
      originalPath={originalPath}
      sessionName={sessionName}
      startExport={startExport}
      closeModal={closeModal}
    />
  );
};
