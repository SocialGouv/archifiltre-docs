import ExportCategoryOptions from "components/modals/export-modal/export-category-options";
import React, { FC } from "react";
import { ExportCategory, ExportType } from "./export-config";

export type ExportTypesMap<ValueType> = {
  [exportType in ExportType]: ValueType;
};

type ExportOptionsProps = {
  enabledExports: ExportTypesMap<boolean>;
  exportPaths: ExportTypesMap<string>;
  isValidPaths: ExportTypesMap<boolean>;
  setActiveExportValue: (exportType: ExportType, value: boolean) => void;
  setExportsPathsValue: (exportType: ExportType, value: string) => void;
};

const ExportOptions: FC<ExportOptionsProps> = ({
  enabledExports,
  exportPaths,
  isValidPaths,
  setActiveExportValue,
  setExportsPathsValue,
}) => (
  <>
    {Object.values(ExportCategory).map((exportCategory) => (
      <ExportCategoryOptions
        exportCategory={exportCategory}
        key={exportCategory}
        enabledExports={enabledExports}
        exportPaths={exportPaths}
        isValidPaths={isValidPaths}
        setActiveExportValue={setActiveExportValue}
        setExportsPathsValue={setExportsPathsValue}
      />
    ))}
  </>
);

export default ExportOptions;
