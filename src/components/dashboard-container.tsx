import React, { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
import { generateCsvExportArray } from "../exporters/csvExporter";
import {
  exportMetsThunk,
  resipExporterThunk
} from "../exporters/export-thunks";
import Dashboard from "./dashboard";

interface DashboardContainerProps {
  api: any;
}

const DashboardContainer: FC<DashboardContainerProps> = ({ api }) => {
  const dispatch = useDispatch();

  const exportToCsv = useCallback(
    filesAndFolders => dispatch(generateCsvExportArray(filesAndFolders)),
    [dispatch]
  );

  const exportToResip = useCallback(
    filesAndFolders => dispatch(resipExporterThunk(filesAndFolders)),
    [dispatch]
  );

  const exportToMets = useCallback(state => dispatch(exportMetsThunk(state)), [
    dispatch
  ]);

  return (
    <Dashboard
      api={api}
      exportToCsv={exportToCsv}
      exportToResip={exportToResip}
      exportToMets={exportToMets}
    />
  );
};

export default DashboardContainer;
