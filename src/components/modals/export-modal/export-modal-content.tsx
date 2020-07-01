import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { useStyles } from "hooks/use-styles";
import _, { negate } from "lodash";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { identity } from "util/function/function-util";
import { exportConfig, ExportType, IsActiveOptions } from "./export-config";
import ExportOptions, { ExportTypesMap } from "./export-options";

const getInitialExportPaths = (originalPath: string, sessionName: string) =>
  Object.assign(
    {},
    ...Object.values(ExportType).map((exportType) => ({
      [exportType]: exportConfig[exportType].exportPath(
        originalPath,
        sessionName
      ),
    }))
  );

const initialExportCheckMap = {
  [ExportType.AUDIT]: false,
  [ExportType.CSV]: false,
  [ExportType.CSV_WITH_HASHES]: false,
  [ExportType.RESIP]: false,
  [ExportType.METS]: false,
};

function mapValuesFromExportType<T>(
  iteratee: (value: ExportType) => T
): ExportTypesMap<T> {
  return _(ExportType)
    .values()
    .keyBy()
    .mapValues(iteratee)
    .value() as ExportTypesMap<T>;
}

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

type ExportModalContentProps = {
  areHashesReady: boolean;
  originalPath: string;
  sessionName: string;
  startExport: (exportId: ExportType, exportPath: string) => void;
};

const ExportModalContent: FC<ExportModalContentProps> = ({
  areHashesReady,
  originalPath,
  sessionName,
  startExport,
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

  useEffect(
    () => setEnabledExports(computeEnabledExports({ areHashesReady })),
    [areHashesReady]
  );

  const onExport = useCallback(
    () =>
      Object.values(ExportType)
        .filter((exportId) => activeExports[exportId])
        .forEach((exportId: ExportType) =>
          startExport(exportId, exportPaths[exportId])
        ),
    [startExport, activeExports, exportPaths]
  );

  const setActiveExportValue = (exportType: ExportType, value: boolean) =>
    setActiveExports({ ...activeExports, [exportType]: value });

  const setExportsPathsValue = (exportType: ExportType, value: string) =>
    setExportsPaths({ ...exportPaths, [exportType]: value });

  return (
    <>
      <DialogContent className={classes.dialogContent}>
        <ExportOptions
          enabledExports={enabledExports}
          exportPaths={exportPaths}
          setActiveExportValue={setActiveExportValue}
          setExportsPathsValue={setExportsPathsValue}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
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
