import ExportCheckbox from "components/modals/export-modal/export-checkbox";
import {
  exportConfig,
  ExportType,
} from "components/modals/export-modal/export-config";
import ExportInput from "components/modals/export-modal/export-input";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ExportTypesMap } from "./export-options";

const ExportContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
`;

type ExportTypeOptionProps = {
  exportType: ExportType;
  enabledExports: ExportTypesMap<boolean>;
  isPathValid: boolean;
  exportPaths: ExportTypesMap<string>;
  setActiveExportValue: (exportType: ExportType, value: boolean) => void;
  setExportsPathsValue: (exportType: ExportType, value: string) => void;
  activeExports: ExportTypesMap<boolean>;
};

const ExportTypeOption: FC<ExportTypeOptionProps> = ({
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
    <ExportContainer key={exportType}>
      <ExportCheckbox
        isActive={enabledExports[exportType] && isPathValid}
        setActiveExportValue={(value) =>
          setActiveExportValue(exportType, value)
        }
        label={t(exportConfig[exportType].label)}
        disabledExplanation={t(
          exportConfig[exportType].disabledExplanation || ""
        )}
        checked={activeExports[exportType]}
      />
      <ExportInput
        exportFilePath={exportPaths[exportType]}
        isValid={isPathValid}
        setExportsPathsValue={(value) =>
          setExportsPathsValue(exportType, value)
        }
        isFilePickerDisabled={exportConfig[exportType].isFilePickerDisabled}
      />
    </ExportContainer>
  );
};

export default ExportTypeOption;
