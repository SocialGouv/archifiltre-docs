import { EventTracker, Palette, type SeriesRef } from "@devexpress/dx-react-chart";
import { Chart, PieSeries, Tooltip, type TooltipProps } from "@devexpress/dx-react-chart-material-ui";
import { grey, orange } from "@mui/material/colors";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { bytes2HumanReadableFormat } from "../../../../../utils";

const ColoredText = styled.span<{ color: string }>`
  display: block;
  color: ${({ color }) => color};
`;

const scheme = [orange["500"], grey["500"]];

export interface DuplicatesChartProps {
  duplicatesNumber: number;
  duplicatesSize: number;
  nonDuplicatesNumber: number;
  nonDuplicatesSize: number;
}

export const DuplicatesChart: React.FC<DuplicatesChartProps> = ({
  duplicatesNumber,
  nonDuplicatesNumber,
  duplicatesSize,
  nonDuplicatesSize,
}) => {
  const { t } = useTranslation();
  const [targetItem, setTargetItem] = useState<SeriesRef>();

  const chartData = useMemo(
    () => [
      {
        key: "duplicates",
        label: t("duplicates.duplicateElements"),
        size: duplicatesSize,
        value: duplicatesNumber,
      },
      {
        key: "nonDuplicates",
        label: t("duplicates.nonDuplicateElements"),
        size: nonDuplicatesSize,
        value: nonDuplicatesNumber,
      },
    ],
    [duplicatesNumber, duplicatesSize, nonDuplicatesNumber, nonDuplicatesSize, t],
  );

  const onTargetItemChange: NonNullable<TooltipProps["onTargetItemChange"]> = useCallback(
    newTargetItem => {
      setTargetItem(newTargetItem);
    },
    [setTargetItem],
  );

  const getTooltipContent: TooltipProps["contentComponent"] = useCallback(
    ({ targetItem: { point } }) => {
      const { label, value, size } = chartData[point];
      return (
        <div>
          <div>{label}</div>
          <ColoredText color={scheme[point]}>{`${value} ${t("duplicates.elements")}`}</ColoredText>
          <ColoredText color={scheme[point]}>{bytes2HumanReadableFormat(size)}</ColoredText>
        </div>
      );
    },
    [chartData, t],
  );

  return (
    <Chart data={chartData} height={140}>
      <Palette scheme={scheme} />
      <PieSeries valueField="value" argumentField="key" innerRadius={0.6} />
      <EventTracker />
      <Tooltip targetItem={targetItem} onTargetItemChange={onTargetItemChange} contentComponent={getTooltipContent} />
    </Chart>
  );
};
