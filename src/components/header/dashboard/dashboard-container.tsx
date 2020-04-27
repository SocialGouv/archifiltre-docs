import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auditReportExporterThunk } from "exporters/audit/audit-report-exporter";
import { csvExporterThunk } from "exporters/csv/csv-exporter";
import { jsonExporterThunk } from "exporters/json/json-exporter";
import { metsExporterThunk } from "exporters/mets/mets-export-thunk";
import { resipExporterThunk } from "exporters/resip/resip-exporter-thunk";
import { getHashesFromStore } from "reducers/files-and-folders/files-and-folders-selectors";
import {
  replayActionsThunk,
  usePreviousSession,
} from "reducers/middleware/persist-actions-middleware";
import { resetStoreThunk } from "reducers/store-thunks";
import { getWorkspaceMetadataFromStore } from "reducers/workspace-metadata/workspace-metadata-selectors";
import Dashboard from "./dashboard";

interface DashboardContainerProps {
  api: any;
}

const ROOT_ID = "";

const DashboardContainer: FC<DashboardContainerProps> = ({ api }) => {
  const dispatch = useDispatch();
  const hasPreviousSession = usePreviousSession();

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

  const hashes = useSelector(getHashesFromStore);
  const areHashesReady = hashes[ROOT_ID] !== undefined;
  const { sessionName, originalPath } = useSelector(
    getWorkspaceMetadataFromStore
  );

  return (
    <Dashboard
      api={api}
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
    />
  );
};

export default DashboardContainer;
