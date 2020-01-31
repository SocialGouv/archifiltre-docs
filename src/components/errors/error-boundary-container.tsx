import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { jsonExporterThunk } from "../../exporters/json/json-exporter";
import { getWorkspaceMetadataFromStore } from "../../reducers/workspace-metadata/workspace-metadata-selectors";
import ErrorBoundary from "./error-boundary";

const ErrorBoundaryContainer: FC = ({ children }) => {
  const { t } = useTranslation();
  const {
    sessionName: currentSessionName,
    originalPath: currentOriginalPath
  } = useSelector(getWorkspaceMetadataFromStore);

  const dispatch = useDispatch();

  const exportToJson = useCallback(
    ({ sessionName, originalPath, version }) =>
      dispatch(jsonExporterThunk({ sessionName, originalPath, version })),
    [dispatch]
  );

  return (
    <ErrorBoundary
      t={t}
      originalPath={currentOriginalPath}
      sessionName={currentSessionName}
      exportToJson={exportToJson}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryContainer;
