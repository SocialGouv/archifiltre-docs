import type { ExportType } from "@common/export/type";
import { ExportCategory } from "@common/export/type";
import Box from "@material-ui/core/Box";
import React from "react";

import { ExportCategoryOptions } from "./export-category-options";
import { ExportControls } from "./export-controls";

export type ExportTypesMap<TValue> = {
  [exportType in ExportType]: TValue;
};

export interface ExportOptionsProps {
  activeExports: ExportTypesMap<boolean>;
  enabledExports: ExportTypesMap<boolean>;
  exportPaths: ExportTypesMap<string>;
  isValidPaths: ExportTypesMap<boolean>;
  setActiveExportValue: (exportType: ExportType, value: boolean) => void;
  setExportsPathsValue: (exportType: ExportType, value: string) => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  enabledExports,
  exportPaths,
  isValidPaths,
  activeExports,
  setActiveExportValue,
  setExportsPathsValue,
}) => {
  return (
    <Box>
      <ExportControls
        setActiveExportValue={setActiveExportValue}
        setExportsPathsValue={setExportsPathsValue}
        activeExports={activeExports}
        exportPaths={exportPaths}
        enabledExports={enabledExports}
      />
      {Object.values(ExportCategory).map((exportCategory) => (
        <ExportCategoryOptions
          exportCategory={exportCategory}
          key={exportCategory}
          enabledExports={enabledExports}
          exportPaths={exportPaths}
          isValidPaths={isValidPaths}
          activeExports={activeExports}
          setActiveExportValue={setActiveExportValue}
          setExportsPathsValue={setExportsPathsValue}
        />
      ))}
    </Box>
  );
};
