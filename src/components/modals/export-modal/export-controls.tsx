import React, { FC } from "react";
import Box from "@material-ui/core/Box";
import { Button } from "@material-ui/core";
import { FaFolderOpen } from "react-icons/fa";
import { exportConfig, ExportType } from "./export-config";
import { useTranslation } from "react-i18next";
import { ExportTypesMap } from "./export-options";
import { remote } from "electron";
import path from "path";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

type ExportControlsProps = {
  setActiveExportValue: (exportType: ExportType, value: boolean) => void;
  setExportsPathsValue: (exportType: ExportType, value: string) => void;
  activeExports: ExportTypesMap<boolean>;
  exportPaths: ExportTypesMap<string>;
  enabledExports: ExportTypesMap<boolean>;
};

const ExportControls: FC<ExportControlsProps> = ({
  setActiveExportValue,
  setExportsPathsValue,
  activeExports,
  exportPaths,
  enabledExports,
}) => {
  const { t } = useTranslation();

  const areAllBoxesChecked = Object.values(ExportType).every(
    (exportType) => activeExports[exportType]
  );

  const setAllBoxes = (checked: boolean) => {
    Object.values(ExportType)
      .filter((exportType) => enabledExports[exportType])
      .forEach((exportType) => {
        setActiveExportValue(exportType, checked);
      });
  };

  const toggleAllBoxes = () => {
    setAllBoxes(!areAllBoxesChecked);
  };

  const browseForAll = async () => {
    const filePath = await remote.dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    Object.values(ExportType)
      .filter((exportType) => !exportConfig[exportType].isFilePickerDisabled)
      .forEach((exportType) => {
        if (filePath.filePaths.length > 0) {
          const folderPath = filePath.filePaths[0];
          const filename = path.basename(exportPaths[exportType]);
          setExportsPathsValue(exportType, `${folderPath}/${filename}`);
        }
      });
  };

  return (
    <Box paddingBottom={1} display="flex" justifyContent="space-between">
      <FormControlLabel
        control={
          <Checkbox checked={areAllBoxesChecked} onChange={toggleAllBoxes} />
        }
        label={
          areAllBoxesChecked
            ? t("exportModal.unselectAll")
            : t("exportModal.selectAll")
        }
      />
      <Button size="small" onClick={browseForAll} endIcon={<FaFolderOpen />}>
        {t("exportModal.browseAll")}
      </Button>
    </Box>
  );
};

export default ExportControls;
