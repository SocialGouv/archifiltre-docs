import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auditReportExporterThunk } from "../../../exporters/audit/audit-report-exporter";
import { csvExporterThunk } from "../../../exporters/csv-exporter";
import {
  metsExporterThunk,
  resipExporterThunk
} from "../../../exporters/export-thunks";
import { jsonExporterThunk } from "../../../exporters/json/json-exporter";
import { getFilesAndFoldersMetadataFromStore } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getFilesAndFoldersFromStore } from "../../../reducers/files-and-folders/files-and-folders-selectors";
import Dashboard from "./dashboard";

interface DashboardContainerProps {
  api: any;
}

const DashboardContainer: FC<DashboardContainerProps> = ({ api }) => {
  const dispatch = useDispatch();

  const exportToCsv = useCallback(name => dispatch(csvExporterThunk(name)), [
    dispatch
  ]);

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

  return (
    <Dashboard
      api={api}
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
