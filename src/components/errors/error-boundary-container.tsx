import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { jsonExporterThunk } from "../../exporters/json/json-exporter";
import ErrorBoundary from "./error-boundary";

interface ErrorBoundaryContainerProps {
  api: any;
}

const ErrorBoundaryContainer: FC<ErrorBoundaryContainerProps> = ({
  api,
  children
}) => {
  const { t } = useTranslation();
  const apiSessionName = (api.getSessionName && api.getSessionName()) || "";
  const apiOriginalPath = (api.getOriginalPath && api.getOriginalPath()) || "";

  const dispatch = useDispatch();

  const exportToJson = useCallback(
    ({ sessionName, originalPath, version }) =>
      dispatch(jsonExporterThunk({ sessionName, originalPath, version })),
    [dispatch]
  );

  return (
    <ErrorBoundary
      t={t}
      originalPath={apiOriginalPath}
      sessionName={apiSessionName}
      exportToJson={exportToJson}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryContainer;
