import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { jsonExporterThunk, type JsonExporterThunkArgs } from "../../exporters/json/json-exporter";
import { getWorkspaceMetadataFromStore } from "../../reducers/workspace-metadata/workspace-metadata-selectors";
import { ErrorBoundary } from "./error-boundary";

export const ErrorBoundaryContainer: React.FC = ({ children }) => {
  const { sessionName: currentSessionName, originalPath: currentOriginalPath } =
    useSelector(getWorkspaceMetadataFromStore);

  const dispatch = useDispatch();

  const exportToJson = useCallback(
    ({ sessionName, originalPath, version }: JsonExporterThunkArgs) =>
      dispatch(jsonExporterThunk({ originalPath, sessionName, version })),
    [dispatch],
  );

  return (
    <ErrorBoundary originalPath={currentOriginalPath} sessionName={currentSessionName} exportToJson={exportToJson}>
      {children}
    </ErrorBoundary>
  );
};
