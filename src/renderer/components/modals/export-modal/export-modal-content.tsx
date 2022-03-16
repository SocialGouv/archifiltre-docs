import { Object } from "@common/utils";
import { identity } from "@common/utils/function";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { find, negate } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useStyles } from "../../../hooks/use-styles";
import { isValidFilePath } from "../../../utils/file-system/file-sys-util";
import type { IsActiveOptions } from "./export-config";
import {
  exportConfig,
  ExportType,
  mapValuesFromExportType,
} from "./export-config";
import type { ExportOptionsProps, ExportTypesMap } from "./export-options";
import { ExportOptions } from "./export-options";

const getInitialExportPaths = (originalPath: string, sessionName: string) =>
  mapValuesFromExportType((exportType) =>
    exportConfig[exportType].exportPath(originalPath, sessionName)
  );

const initialExportCheckMap = mapValuesFromExportType(() => false);

const computeEnabledExports = (
  options: IsActiveOptions
): ExportTypesMap<boolean> =>
  mapValuesFromExportType((exportType) => {
    const { isActive } = exportConfig[exportType];
    return typeof isActive === "function" ? isActive(options) : isActive;
  });

const defaultEnabledExports: ExportTypesMap<boolean> = mapValuesFromExportType(
  () => false
);

const computeExportPathsValidityMap = async (
  exportPathsMap: ExportTypesMap<string>
): Promise<ExportTypesMap<boolean>> => {
  const resultsArray = await Promise.all(
    Object.keys(exportPathsMap).map(async (key: ExportType) =>
      isValidFilePath(exportPathsMap[key]).then((isValid) => ({
        isValid,
        key,
      }))
    )
  );

  return mapValuesFromExportType(
    (key) => find(resultsArray, { key })?.isValid ?? false
  );
};

export interface ExportModalContentProps {
  areHashesReady: boolean;
  originalPath: string;
  sessionName: string;
  startExport: (exportId: ExportType, exportPath: string) => void;
  closeModal: () => void;
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
    getInitialExportPaths(originalPath, sessionName)
  );
  const [activeExports, setActiveExports] = useState(initialExportCheckMap);
  const [enabledExports, setEnabledExports] = useState<ExportTypesMap<boolean>>(
    defaultEnabledExports
  );
  const [validPaths, setValidPaths] = useState(initialExportCheckMap);

  useEffect(() => {
    setEnabledExports(computeEnabledExports({ areHashesReady }));
  }, [areHashesReady]);

  const onExport = useCallback(() => {
    closeModal();
    Object.values(ExportType)
      .filter((exportId) => activeExports[exportId])
      .forEach((exportId: ExportType) => {
        startExport(exportId, exportPaths[exportId]);
      });
  }, [startExport, activeExports, exportPaths, closeModal]);

  useEffect(() => {
    void computeExportPathsValidityMap(exportPaths).then(setValidPaths);
  }, [exportPaths, setValidPaths]);

  const setActiveExportValue: ExportOptionsProps["setActiveExportValue"] = (
    exportType,
    value
  ) => {
    setActiveExports((activeExportsToSet) => ({
      ...activeExportsToSet,
      [exportType]: value,
    }));
  };

  const setExportsPathsValue: ExportOptionsProps["setExportsPathsValue"] = (
    exportType,
    value
  ) => {
    setExportsPaths((exportPathsToSet) => ({
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
        >
          {t("exportModal.buttonTitle")}
        </Button>
      </DialogActions>
    </>
  );
};
