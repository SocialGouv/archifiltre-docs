import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { csvExporterThunk } from "../exporters/csv-exporter";
import {
  metsExporterThunk,
  resipExporterThunk
} from "../exporters/export-thunks";
import Dashboard from "./dashboard";
import { getFilesAndFoldersMetadataFromStore } from "../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getFilesAndFoldersFromStore } from "../reducers/files-and-folders/files-and-folders-selectors";

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

  const metadata = useSelector(getFilesAndFoldersMetadataFromStore);
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
  const rootFilesAndFoldersMetadata = metadata[""] || {};

  return (
    <Dashboard
      api={api}
      exportToCsv={exportToCsv}
      exportToResip={exportToResip}
      exportToMets={exportToMets}
      rootFilesAndFoldersMetadata={rootFilesAndFoldersMetadata}
      filesAndFolders={filesAndFolders}
    />
  );
};

export default DashboardContainer;
