import grey from "@material-ui/core/colors/grey";
import orange from "@material-ui/core/colors/orange";
import React, { FC, useCallback, useMemo, useState } from "react";
import { EventTracker, Palette } from "@devexpress/dx-react-chart";
import {
  Chart,
  PieSeries,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { useTranslation } from "react-i18next";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import styled from "styled-components";

const ColoredText = styled.span<{ color: string }>`
  display: block;
  color: ${({ color }) => color};
`;

const scheme = [orange["500"], grey["500"]];

type DuplicatesChartProps = {
  duplicatesNumber: number;
  nonDuplicatesNumber: number;
  duplicatesSize: number;
  nonDuplicatesSize: number;
};

const DuplicatesChart: FC<DuplicatesChartProps> = ({
  duplicatesNumber,
  nonDuplicatesNumber,
  duplicatesSize,
  nonDuplicatesSize,
}) => {
  const { t } = useTranslation();
  const [targetItem, setTargetItem] = useState();

  const chartData = useMemo(
    () => [
      {
        key: "duplicates",
        label: t("workspace.duplicates.duplicateElements"),
        value: duplicatesNumber,
        size: duplicatesSize,
      },
      {
        key: "nonDuplicates",
        label: t("workspace.duplicates.nonDuplicateElements"),
        value: nonDuplicatesNumber,
        size: nonDuplicatesSize,
      },
    ],
    [duplicatesNumber, duplicatesSize, nonDuplicatesNumber, nonDuplicatesSize]
  );

  const onTargetItemChange = useCallback(
    (newTargetItem) => setTargetItem(newTargetItem),
    [setTargetItem]
  );

  const getTooltipContent = useCallback(
    ({ targetItem: { point } }) => {
      const { label, value, size } = chartData[point];
      return (
        <div>
          <div>{label}</div>
          <ColoredText color={scheme[point]}>{`${value} ${t(
            "workspace.duplicates.elements"
          )}`}</ColoredText>
          <ColoredText color={scheme[point]}>
            {octet2HumanReadableFormat(size)}
          </ColoredText>
        </div>
      );
    },
    [chartData]
  );

  return (
    <Chart data={chartData} height={140}>
      <Palette scheme={scheme} />
      <PieSeries valueField="value" argumentField="key" innerRadius={0.6} />
      <EventTracker />
      <Tooltip
        targetItem={targetItem}
        onTargetItemChange={onTargetItemChange}
        contentComponent={getTooltipContent}
      />
    </Chart>
  );
};

export default DuplicatesChart;
