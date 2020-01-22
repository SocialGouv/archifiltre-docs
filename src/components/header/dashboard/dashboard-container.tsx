import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auditReportExporterThunk } from "../../../exporters/audit/audit-report-exporter";
import { csvExporterThunk } from "../../../exporters/csv/csv-exporter";
import {
  metsExporterThunk,
  resipExporterThunk
} from "../../../exporters/export-thunks";
import { jsonExporterThunk } from "../../../exporters/json/json-exporter";
import { getFilesAndFoldersMetadataFromStore } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getFilesAndFoldersFromStore,
  getHashesFromStore
} from "../../../reducers/files-and-folders/files-and-folders-selectors";
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
    ({ sessionName, originalPath, version }) =>
      dispatch(jsonExporterThunk({ sessionName, originalPath, version })),
    [dispatch]
  );

  const metadata = useSelector(getFilesAndFoldersMetadataFromStore);
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
  const rootFilesAndFoldersMetadata = metadata[""] || {};
  const hashes = useSelector(getHashesFromStore);
  const areHashesReady = hashes[ROOT_ID] !== undefined;

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
