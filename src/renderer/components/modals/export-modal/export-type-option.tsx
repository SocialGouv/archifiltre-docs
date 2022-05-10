import type { ExportType } from "@common/export/type";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { ExportCheckbox } from "./export-checkbox";
import { exportConfig } from "./export-config";
import { ExportInput } from "./export-input";
import type { ExportTypesMap } from "./export-options";

const ExportContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
`;

export interface ExportTypeOptionProps {
  activeExports: ExportTypesMap<boolean>;
  enabledExports: ExportTypesMap<boolean>;
  exportPaths: ExportTypesMap<string>;
  exportType: ExportType;
  isPathValid: boolean;
  setActiveExportValue: (exportType: ExportType, value: boolean) => void;
  setExportsPathsValue: (exportType: ExportType, value: string) => void;
}

export const ExportTypeOption: React.FC<ExportTypeOptionProps> = ({
  exportType,
  enabledExports,
  isPathValid,
  setActiveExportValue,
  exportPaths,
  setExportsPathsValue,
  activeExports,
}) => {
  const { t } = useTranslation();

  return (
    <ExportContainer
      key={exportType}
      data-test-id={`export-type-container-${exportType}`}
    >
      <ExportCheckbox
        isActive={enabledExports[exportType] && isPathValid}
        setActiveExportValue={(value) => {
          setActiveExportValue(exportType, value);
        }}
        label={t(exportConfig[exportType].label)}
        disabledExplanation={t(
          exportConfig[exportType].disabledExplanation ?? ""
        )}
        checked={activeExports[exportType]}
      />
      <ExportInput
        exportFilePath={exportPaths[exportType]}
        isValid={isPathValid}
        setExportsPathsValue={(value) => {
          setExportsPathsValue(exportType, value);
        }}
        isFilePickerDisabled={exportConfig[exportType].isFilePickerDisabled}
      />
    </ExportContainer>
  );
};
