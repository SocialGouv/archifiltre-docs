import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useTranslation } from "react-i18next";

import { exportConfig, ExportType } from "./export-config";
import type { ExportTypesMap } from "./export-options";
import { ExportTypeOption } from "./export-type-option";

export interface ExportCategoryOptionsProps {
    exportCategory: string;
    enabledExports: ExportTypesMap<boolean>;
    exportPaths: ExportTypesMap<string>;
    isValidPaths: ExportTypesMap<boolean>;
    activeExports: ExportTypesMap<boolean>;
    setActiveExportValue: (exportType: ExportType, value: boolean) => void;
    setExportsPathsValue: (exportType: ExportType, value: string) => void;
}

export const ExportCategoryOptions: React.FC<ExportCategoryOptionsProps> = ({
    exportCategory,
    enabledExports,
    exportPaths,
    isValidPaths,
    activeExports,
    setActiveExportValue,
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
                    (exportType) =>
                        exportConfig[exportType].category === exportCategory
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
                        activeExports={activeExports}
                    />
                ))}
        </Box>
    );
};
