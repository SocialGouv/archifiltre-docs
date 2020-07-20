import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jsonExporterThunk } from "exporters/json/json-exporter";
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
} from "reducers/enhancers/undoable/undoable-actions";
import { StoreState } from "reducers/store";
import {
  canStateRedo,
  canStateUndo,
} from "reducers/enhancers/undoable/undoable-selectors";
import { useLoadingStep } from "reducers/loading-state/loading-state-selectors";
import { LoadingStep } from "reducers/loading-state/loading-state-types";

const DashboardContainer: FC = () => {
  const dispatch = useDispatch();
  const hasPreviousSession = usePreviousSession();

  const loadingStep = useLoadingStep();
  const finished = loadingStep === LoadingStep.FINISHED;
  const error = loadingStep === LoadingStep.ERROR;
  const started =
    loadingStep === LoadingStep.STARTED || loadingStep === LoadingStep.FINISHED;

  const reloadPreviousSession = useCallback(() => {
    dispatch(replayActionsThunk());
  }, [dispatch]);

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

  const resetWorkspace = useCallback(() => dispatch(resetStoreThunk()), [
    dispatch,
  ]);

  const { sessionName, originalPath } = useSelector(
    getWorkspaceMetadataFromStore
  );

  return (
    <Dashboard
      hasPreviousSession={hasPreviousSession}
      originalPath={originalPath}
      sessionName={sessionName}
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
