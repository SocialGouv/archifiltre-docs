import React, { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
import { csvExporterThunk } from "../exporters/csv-exporter";
import {
  metsExporterThunk,
  resipExporterThunk
} from "../exporters/export-thunks";
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
