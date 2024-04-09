import { ExportType } from "@common/export/type";
import { Object } from "@common/utils";
import { identity } from "@common/utils/function";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { find, negate } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useStyles } from "../../../hooks/use-styles";
import { isValidFilePath } from "../../../utils/file-system/file-sys-util";
import { exportConfig, type IsActiveOptions, mapValuesFromExportType } from "./export-config";
import { ExportOptions, type ExportOptionsProps, type ExportTypesMap } from "./export-options";

const getInitialExportPaths = (originalPath: string, sessionName: string) =>
  mapValuesFromExportType(exportType => exportConfig[exportType].exportPath(originalPath, sessionName));

const initialExportCheckMap = mapValuesFromExportType(() => false);

const computeEnabledExports = (options: IsActiveOptions): ExportTypesMap<boolean> =>
  mapValuesFromExportType(exportType => {
    const { isActive } = exportConfig[exportType];
    return typeof isActive === "function" ? isActive(options) : isActive;
  });

const defaultEnabledExports: ExportTypesMap<boolean> = mapValuesFromExportType(() => false);

const computeExportPathsValidityMap = (exportPathsMap: ExportTypesMap<string>): ExportTypesMap<boolean> => {
  const resultsArray = Object.keys(exportPathsMap).map((key: ExportType) => ({
    isValid: isValidFilePath(exportPathsMap[key]),
    key,
  }));

  return mapValuesFromExportType(key => !!find(resultsArray, { key })?.isValid);
};

export interface ExportModalContentProps {
  areHashesReady: boolean;
  closeModal: () => void;
  originalPath: string;
  sessionName: string;
  startExport: (exportId: ExportType, exportPath: string) => void;
}

export const ExportModalContent: React.FC<ExportModalContentProps> = ({
  areHashesReady,
  originalPath,
  sessionName,
  startExport,
  closeModal,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [exportPaths, setExportsPaths] = useState<ExportTypesMap<string>>(
    getInitialExportPaths(originalPath, sessionName),
  );
  const [activeExports, setActiveExports] = useState(initialExportCheckMap);
  const [enabledExports, setEnabledExports] = useState<ExportTypesMap<boolean>>(defaultEnabledExports);
  const [validPaths, setValidPaths] = useState(initialExportCheckMap);

  useEffect(() => {
    setEnabledExports(computeEnabledExports({ areHashesReady }));
  }, [areHashesReady]);

  const onExport = useCallback(() => {
    closeModal();
    Object.values(ExportType)
      .filter(exportId => activeExports[exportId])
      .forEach((exportId: ExportType) => {
        startExport(exportId, exportPaths[exportId]);
      });
  }, [startExport, activeExports, exportPaths, closeModal]);

  useEffect(() => {
    setValidPaths(computeExportPathsValidityMap(exportPaths));
  }, [exportPaths, setValidPaths]);

  const setActiveExportValue: ExportOptionsProps["setActiveExportValue"] = (exportType, value) => {
    setActiveExports(activeExportsToSet => ({
      ...activeExportsToSet,
      [exportType]: value,
    }));
  };

  const setExportsPathsValue: ExportOptionsProps["setExportsPathsValue"] = (exportType, value) => {
    setExportsPaths(exportPathsToSet => ({
      ...exportPathsToSet,
      [exportType]: value,
    }));
  };

  return (
    <>
      <DialogContent className={classes.dialogContent}>
        <ExportOptions
          enabledExports={enabledExports}
          exportPaths={exportPaths}
          isValidPaths={validPaths}
          setActiveExportValue={setActiveExportValue}
          setExportsPathsValue={setExportsPathsValue}
          activeExports={activeExports}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          disableElevation
          disabled={Object.values(activeExports).every(negate(identity))}
          onClick={onExport}
          data-test-id="export-submit"
        >
          {t("exportModal.buttonTitle")}
        </Button>
      </DialogActions>
    </>
  );
};
