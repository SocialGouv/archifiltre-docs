import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auditReportExporterThunk } from "exporters/audit/audit-report-exporter";
import { csvExporterThunk } from "exporters/csv/csv-exporter";
import { jsonExporterThunk } from "exporters/json/json-exporter";
import { metsExporterThunk } from "exporters/mets/mets-export-thunk";
import { resipExporterThunk } from "exporters/resip/resip-exporter-thunk";
import { getAreHashesReady } from "reducers/files-and-folders/files-and-folders-selectors";
import {
  replayActionsThunk,
  usePreviousSession,
} from "reducers/middleware/persist-actions-middleware";
import { resetStoreThunk } from "reducers/store-thunks";
import { getWorkspaceMetadataFromStore } from "reducers/workspace-metadata/workspace-metadata-selectors";
import Dashboard from "./dashboard";
import {
  redoAction,
  undoAction,
} from "../../../reducers/enhancers/undoable/undoable-actions";
import { StoreState } from "../../../reducers/store";
import {
  canStateRedo,
  canStateUndo,
} from "../../../reducers/enhancers/undoable/undoable-selectors";
import { useLoadingStep } from "../../../reducers/loading-state/loading-state-selectors";
import { LoadingStep } from "../../../reducers/loading-state/loading-state-types";

interface DashboardContainerProps {
  api: any;
}

const DashboardContainer: FC<DashboardContainerProps> = ({ api }) => {
  const dispatch = useDispatch();
  const hasPreviousSession = usePreviousSession();

  const loadingStep = useLoadingStep();
  const finished = loadingStep === LoadingStep.FINISHED;
  const error = loadingStep === LoadingStep.ERROR;
  const started =
    loadingStep === LoadingStep.STARTED || loadingStep === LoadingStep.FINISHED;

  const reloadPreviousSession = useCallback(() => {
    dispatch(replayActionsThunk(api));
  }, [dispatch, api]);

  const exportToCsv = useCallback(
    (name, options) => dispatch(csvExporterThunk(name, options)),
    [dispatch]
  );

  const exportToResip = useCallback(
    (name) => dispatch(resipExporterThunk(name)),
    [dispatch]
  );

  const exportToMets = useCallback(
    (state) => dispatch(metsExporterThunk(state)),
    [dispatch]
  );

  const exportToAuditReport = useCallback(
    (name) => dispatch(auditReportExporterThunk(name)),
    [dispatch]
  );

  const undo = useCallback(() => {
    dispatch(undoAction());
  }, [dispatch]);

  const redo = useCallback(() => {
    dispatch(redoAction());
  }, [dispatch]);

  const canRedo = useSelector((store: StoreState) =>
    canStateRedo(store.filesAndFolders)
  );
  const canUndo = useSelector((store: StoreState) =>
    canStateUndo(store.filesAndFolders)
  );

  const exportToJson = useCallback(
    ({ sessionName: newSessionName, originalPath: newOriginalPath, version }) =>
      dispatch(
        jsonExporterThunk({
          originalPath: newOriginalPath,
          sessionName: newSessionName,
          version,
        })
      ),
    [dispatch]
  );

  const resetWorkspace = useCallback(() => dispatch(resetStoreThunk(api)), [
    dispatch,
    api,
  ]);

  const areHashesReady = useSelector(getAreHashesReady);
  const { sessionName, originalPath } = useSelector(
    getWorkspaceMetadataFromStore
  );

  return (
    <Dashboard
      areHashesReady={areHashesReady}
      hasPreviousSession={hasPreviousSession}
      originalPath={originalPath}
      sessionName={sessionName}
      exportToAuditReport={exportToAuditReport}
      exportToCsv={exportToCsv}
      exportToResip={exportToResip}
      exportToMets={exportToMets}
      exportToJson={exportToJson}
      reloadPreviousSession={reloadPreviousSession}
      resetWorkspace={resetWorkspace}
      finished={finished}
      error={error}
      started={started}
      undo={undo}
      redo={redo}
      canRedo={canRedo}
      canUndo={canUndo}
    />
  );
};

export default DashboardContainer;
