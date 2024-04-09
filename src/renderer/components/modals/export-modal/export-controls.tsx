import { ExportType } from "@common/export/type";
import { ipcRenderer } from "@common/ipc";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import path from "path";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaFolderOpen } from "react-icons/fa";

import { exportConfig } from "./export-config";
import { type ExportTypesMap } from "./export-options";

export interface ExportControlsProps {
  activeExports: ExportTypesMap<boolean>;
  enabledExports: ExportTypesMap<boolean>;
  exportPaths: ExportTypesMap<string>;
  setActiveExportValue: (exportType: ExportType, value: boolean) => void;
  setExportsPathsValue: (exportType: ExportType, value: string) => void;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  setActiveExportValue,
  setExportsPathsValue,
  activeExports,
  exportPaths,
  enabledExports,
}) => {
  const { t } = useTranslation();

  const areAllBoxesChecked = Object.values(ExportType).every(exportType => activeExports[exportType]);

  const setAllBoxes = (checked: boolean) => {
    Object.values(ExportType)
      .filter(exportType => enabledExports[exportType])
      .forEach(exportType => {
        setActiveExportValue(exportType, checked);
      });
  };

  const toggleAllBoxes = () => {
    setAllBoxes(!areAllBoxesChecked);
  };

  const browseForAll = async () => {
    const filePath = await ipcRenderer.invoke("dialog.showOpenDialog", {
      properties: ["openDirectory"],
    });

    Object.values(ExportType)
      .filter(exportType => !exportConfig[exportType].isFilePickerDisabled)
      .forEach(exportType => {
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
        control={<Checkbox checked={areAllBoxesChecked} onChange={toggleAllBoxes} />}
        label={areAllBoxesChecked ? t("exportModal.unselectAll") : t("exportModal.selectAll")}
      />
      <Button size="small" onClick={browseForAll} endIcon={<FaFolderOpen />}>
        {t("exportModal.browseAll")}
      </Button>
    </Box>
  );
};
