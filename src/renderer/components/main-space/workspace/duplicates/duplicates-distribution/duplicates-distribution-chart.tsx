import { EventTracker, Palette } from "@devexpress/dx-react-chart";
import {
  Chart,
  PieSeries,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import type { FileTypeMap } from "../../../../../exporters/audit/audit-report-values-computer";
import { bytes2HumanReadableFormat } from "../../../../../utils";
import { colors } from "../../../../../utils/color";
import type { FileType } from "../../../../../utils/file-types";

const ColoredText = styled.span<{ color: string }>`
  display: block;
  color: ${({ color }) => color};
`;

export interface DuplicatesDistributionChartProps {
  fileSizesCount: Record<FileType, number>;
  fileTypesCount: FileTypeMap<number>;
}

export const DuplicatesDistributionChart: React.FC<
  DuplicatesDistributionChartProps
> = ({ fileTypesCount, fileSizesCount }) => {
  const { t } = useTranslation();

  const chartData = useMemo(
    () =>
      Object.entries(fileTypesCount).map(([fileType, fileTypeValue]) => ({
        key: fileType as FileType,
        label: t(`common.fileTypes.${fileType}`),
        size: fileSizesCount[fileType as FileType],
        value: fileTypeValue,
      })),
    [fileTypesCount, fileSizesCount, t]
  );

  const scheme = useMemo(
    () => chartData.map(({ key }) => colors[key]),
    [chartData]
  );

  const getTooltipContent = useCallback(
    ({ targetItem: { point } }) => {
      const { key, label, value, size } = chartData[point];
      return (
        <div>
          <div>{label}</div>
          <ColoredText color={colors[key]}>{`${value} ${t(
            "duplicates.duplicates"
          )}`}</ColoredText>
          <ColoredText color={colors[key]}>
            {bytes2HumanReadableFormat(size)}
          </ColoredText>
        </div>
      );
    },
    [chartData, t]
  );

  return (
    <Chart data={chartData} height={140}>
      <Palette scheme={scheme} />
      <PieSeries valueField="value" argumentField="key" innerRadius={0.6} />
      <EventTracker />
      <Tooltip contentComponent={getTooltipContent} />
    </Chart>
  );
};
