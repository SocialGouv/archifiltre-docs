import ExportCategoryOptions from "components/modals/export-modal/export-category-options";
import React, { FC } from "react";
import { ExportCategory, ExportType } from "./export-config";
import Box from "@material-ui/core/Box";
import ExportControls from "./export-controls";

export type ExportTypesMap<ValueType> = {
  [exportType in ExportType]: ValueType;
};

type ExportOptionsProps = {
  enabledExports: ExportTypesMap<boolean>;
  exportPaths: ExportTypesMap<string>;
  isValidPaths: ExportTypesMap<boolean>;
  activeExports: ExportTypesMap<boolean>;
  setActiveExportValue: (exportType: ExportType, value: boolean) => void;
  setExportsPathsValue: (exportType: ExportType, value: string) => void;
};

const ExportOptions: FC<ExportOptionsProps> = ({
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

export default ExportOptions;
