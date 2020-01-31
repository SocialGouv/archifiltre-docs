import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auditReportExporterThunk } from "../../../exporters/audit/audit-report-exporter";
import { csvExporterThunk } from "../../../exporters/csv/csv-exporter";
import { jsonExporterThunk } from "../../../exporters/json/json-exporter";
import { metsExporterThunk } from "../../../exporters/mets/mets-export-thunk";
import { resipExporterThunk } from "../../../exporters/resip/resip-exporter-thunk";
import { getFilesAndFoldersMetadataFromStore } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getFilesAndFoldersFromStore,
  getHashesFromStore
} from "../../../reducers/files-and-folders/files-and-folders-selectors";
import { resetStoreThunk } from "../../../reducers/store-thunks";
import { getWorkspaceMetadataFromStore } from "../../../reducers/workspace-metadata/workspace-metadata-selectors";
import { setSessionNameThunk } from "../../../reducers/workspace-metadata/workspace-metadata-thunk";
import Dashboard from "./dashboard";

interface DashboardContainerProps {
  api: any;
}

const ROOT_ID = "";

const DashboardContainer: FC<DashboardContainerProps> = ({ api }) => {
  const dispatch = useDispatch();

  const exportToCsv = useCallback(
    (name, options) => dispatch(csvExporterThunk(name, options)),
    [dispatch]
  );

  const exportToResip = useCallback(
    name => dispatch(resipExporterThunk(name)),
    [dispatch]
  );

  const exportToMets = useCallback(
    state => dispatch(metsExporterThunk(state)),
    [dispatch]
  );

  const exportToAuditReport = useCallback(
    name => dispatch(auditReportExporterThunk(name)),
    [dispatch]
  );

  const exportToJson = useCallback(
    ({ sessionName: newSessionName, originalPath: newOriginalPath, version }) =>
      dispatch(
        jsonExporterThunk({
          originalPath: newOriginalPath,
          sessionName: newSessionName,
          version
        })
      ),
    [dispatch]
  );

  const resetWorkspace = useCallback(() => dispatch(resetStoreThunk(api)), [
    dispatch,
    api
  ]);

  const setSessionName = useCallback(
    newSessionName => dispatch(setSessionNameThunk(newSessionName, api)),
    [dispatch, api]
  );

  const metadata = useSelector(getFilesAndFoldersMetadataFromStore);
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
  const rootFilesAndFoldersMetadata = metadata[""] || {};
  const hashes = useSelector(getHashesFromStore);
  const areHashesReady = hashes[ROOT_ID] !== undefined;
  const { sessionName, originalPath } = useSelector(
    getWorkspaceMetadataFromStore
  );

  return (
    <Dashboard
      api={api}
      areHashesReady={areHashesReady}
      originalPath={originalPath}
      sessionName={sessionName}
      exportToAuditReport={exportToAuditReport}
      exportToCsv={exportToCsv}
      exportToResip={exportToResip}
      exportToMets={exportToMets}
      exportToJson={exportToJson}
      resetWorkspace={resetWorkspace}
      rootFilesAndFoldersMetadata={rootFilesAndFoldersMetadata}
      filesAndFolders={filesAndFolders}
      setSessionName={setSessionName}
    />
  );
};

export default DashboardContainer;
