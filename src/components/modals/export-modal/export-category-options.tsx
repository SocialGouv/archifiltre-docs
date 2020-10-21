import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {
  exportConfig,
  ExportType,
} from "components/modals/export-modal/export-config";
import { ExportTypesMap } from "components/modals/export-modal/export-options";
import ExportTypeOption from "components/modals/export-modal/export-type-option";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

type ExportCategoryOptionsProps = {
  exportCategory: string;
  enabledExports: ExportTypesMap<boolean>;
  exportPaths: ExportTypesMap<string>;
  isValidPaths: ExportTypesMap<boolean>;
  setActiveExportValue: (exportType: ExportType, value: boolean) => void;
  setExportsPathsValue: (exportType: ExportType, value: string) => void;
};

const ExportCategoryOptions: FC<ExportCategoryOptionsProps> = ({
  exportCategory,
  enabledExports,
  setActiveExportValue,
  isValidPaths,
  exportPaths,
  setExportsPathsValue,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h5" color="textSecondary">
        {t(`exportModal.${exportCategory}`)}
      </Typography>
      {Object.values(ExportType)
        .filter(
          (exportType) => exportConfig[exportType].category === exportCategory
        )
        .map((exportType: ExportType) => (
          <ExportTypeOption
            key={exportType}
            exportType={exportType}
            isPathValid={isValidPaths[exportType]}
            enabledExports={enabledExports}
            setActiveExportValue={setActiveExportValue}
            exportPaths={exportPaths}
            setExportsPathsValue={setExportsPathsValue}
          />
        ))}
    </Box>
  );
};

export default ExportCategoryOptions;
