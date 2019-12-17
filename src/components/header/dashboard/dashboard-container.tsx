import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auditReportExporterThunk } from "../../../exporters/audit/audit-report-exporter";
import { csvExporterThunk } from "../../../exporters/csv-exporter";
import {
  metsExporterThunk,
  resipExporterThunk
} from "../../../exporters/export-thunks";
import { jsonExporterThunk } from "../../../exporters/json/json-exporter";
import { LOAD_FILE_FOLDER_HASH_ACTION_ID } from "../../../hash-computer/hash-computer-thunk";
import { getFilesAndFoldersMetadataFromStore } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getFilesAndFoldersFromStore } from "../../../reducers/files-and-folders/files-and-folders-selectors";
import { getLoadingInfoFromStore } from "../../../reducers/loading-info/loading-info-selectors";
import Dashboard from "./dashboard";

interface DashboardContainerProps {
  api: any;
}

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
    ({ sessionName, originalPath, version }) =>
      dispatch(jsonExporterThunk({ sessionName, originalPath, version })),
    [dispatch]
  );

  const metadata = useSelector(getFilesAndFoldersMetadataFromStore);
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
  const rootFilesAndFoldersMetadata = metadata[""] || {};
  const loadingInfo = useSelector(getLoadingInfoFromStore);
  const areHashesReady =
    loadingInfo.complete.includes(LOAD_FILE_FOLDER_HASH_ACTION_ID) ||
    loadingInfo.dismissed.includes(LOAD_FILE_FOLDER_HASH_ACTION_ID);

  return (
    <Dashboard
      api={api}
      areHashesReady={areHashesReady}
      exportToAuditReport={exportToAuditReport}
      exportToCsv={exportToCsv}
      exportToResip={exportToResip}
      exportToMets={exportToMets}
      exportToJson={exportToJson}
      rootFilesAndFoldersMetadata={rootFilesAndFoldersMetadata}
      filesAndFolders={filesAndFolders}
    />
  );
};

export default DashboardContainer;
