import ExportCheckbox from "components/modals/export-modal/export-checkbox";
import { exportConfig } from "components/modals/export-modal/export-config";
import ExportInput from "components/modals/export-modal/export-input";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const ExportContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
`;

type ExportTypeOptionProps = {
  exportType;
  enabledExports;
  setActiveExportValue;
  exportPaths;
  setExportsPathsValue;
};

const ExportTypeOption: FC<ExportTypeOptionProps> = ({
  exportType,
  enabledExports,
  setActiveExportValue,
  exportPaths,
  setExportsPathsValue,
}) => {
  const { t } = useTranslation();

  return (
    <ExportContainer key={exportType}>
      <ExportCheckbox
        isActive={enabledExports[exportType]}
        setActiveExportValue={(value) =>
          setActiveExportValue(exportType, value)
        }
        label={t(exportConfig[exportType].label)}
        disabledExplanation={t(
          exportConfig[exportType].disabledExplanation || ""
        )}
      />
      <ExportInput
        exportFilePath={exportPaths[exportType]}
        setExportsPathsValue={(value) =>
          setExportsPathsValue(exportType, value)
        }
        isFilePickerDisabled={exportConfig[exportType].isFilePickerDisabled}
      />
    </ExportContainer>
  );
};

export default ExportTypeOption;
