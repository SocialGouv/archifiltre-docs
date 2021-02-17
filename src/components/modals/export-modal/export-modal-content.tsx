import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { useStyles } from "hooks/use-styles";
import _, { find, negate } from "lodash";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { identity } from "util/function/function-util";
import {
  exportConfig,
  ExportType,
  IsActiveOptions,
  mapValuesFromExportType,
} from "./export-config";
import ExportOptions, { ExportTypesMap } from "./export-options";
import { isValidFilePath } from "util/file-system/file-sys-util";

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
    Object.keys(exportPathsMap).map((key: ExportType) =>
      isValidFilePath(exportPathsMap[key]).then((isValid) => ({
        key,
        isValid,
      }))
    )
  );

  return mapValuesFromExportType(
    (key) => find(resultsArray, { key })?.isValid || false
  );
};

type ExportModalContentProps = {
  areHashesReady: boolean;
  originalPath: string;
  sessionName: string;
  startExport: (exportId: ExportType, exportPath: string) => void;
  closeModal: () => void;
};

const ExportModalContent: FC<ExportModalContentProps> = ({
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

  useEffect(
    () => setEnabledExports(computeEnabledExports({ areHashesReady })),
    [areHashesReady]
  );

  const onExport = useCallback(() => {
    closeModal();
    return Object.values(ExportType)
      .filter((exportId) => activeExports[exportId])
      .forEach((exportId: ExportType) =>
        startExport(exportId, exportPaths[exportId])
      );
  }, [startExport, activeExports, exportPaths]);

  useEffect(() => {
    computeExportPathsValidityMap(exportPaths).then(setValidPaths);
  }, [exportPaths, setValidPaths]);

  const setActiveExportValue = (exportType: ExportType, value: boolean) =>
    setActiveExports((activeExports) => ({
      ...activeExports,
      [exportType]: value,
    }));

  const setExportsPathsValue = (exportType: ExportType, value: string) =>
    setExportsPaths((exportPaths) => ({ ...exportPaths, [exportType]: value }));

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

export default ExportModalContent;
