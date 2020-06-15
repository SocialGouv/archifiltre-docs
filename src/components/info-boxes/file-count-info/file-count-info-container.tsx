import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auditReportExporterThunk } from "exporters/audit/audit-report-exporter";
import {
  getAreHashesReady,
  getFileCount,
  getFilesAndFoldersFromStore,
} from "reducers/files-and-folders/files-and-folders-selectors";
import FileCountInfo from "./file-count-info";

const FileCountInfoContainer: FC = () => {
  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);

  const fileCount = useMemo(() => getFileCount(filesAndFoldersMap), [
    filesAndFoldersMap,
  ]);

  const areHashesReady = useSelector(getAreHashesReady);
  const dispatch = useDispatch();
  const exportToAuditReport = useCallback(
    (name) => dispatch(auditReportExporterThunk(name)),
    [dispatch]
  );

  return (
    <FileCountInfo
      fileCount={fileCount}
      areHashesReady={areHashesReady}
      exportToAuditReport={exportToAuditReport}
    />
  );
};

export default FileCountInfoContainer;
