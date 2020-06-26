import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import ExportCheckbox from "./export-checkbox";
import { exportConfig, ExportType } from "./export-config";
import ExportInput from "./export-input";

export type ExportTypesMap<ValueType> = {
  [exportType in ExportType]: ValueType;
};

const ExportContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
`;

type ExportOptionsProps = {
  enabledExports: ExportTypesMap<boolean>;
  exportPaths: ExportTypesMap<string>;
  setActiveExportValue: (exportType: ExportType, value: boolean) => void;
  setExportsPathsValue: (exportType: ExportType, value: string) => void;
};

const ExportOptions: FC<ExportOptionsProps> = ({
  enabledExports,
  exportPaths,
  setActiveExportValue,
  setExportsPathsValue,
}) => {
  const { t } = useTranslation();
  return (
    <>
      {Object.values(ExportType).map((exportType: ExportType) => (
        <ExportContainer key={exportType}>
          <ExportCheckbox
            isActive={enabledExports[exportType]}
            setActiveExportValue={(value) =>
              setActiveExportValue(exportType, value)
            }
            label={t(exportConfig[exportType].label)}
            disabledExplanation={
              exportConfig[exportType].disabledExplanation || ""
            }
          />
          <ExportInput
            exportFilePath={exportPaths[exportType]}
            setExportsPathsValue={(value) =>
              setExportsPathsValue(exportType, value)
            }
          />
        </ExportContainer>
      ))}
    </>
  );
};

export default ExportOptions;
