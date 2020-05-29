import React, { FC, useCallback, useState } from "react";
import { EventTracker } from "@devexpress/dx-react-chart";
import {
  Chart,
  PieSeries,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { useTranslation } from "react-i18next";
import { octet2HumanReadableFormat } from "../../../util/file-system/file-sys-util";

type DuplicatesChartProps = {
  duplicatesNumber: number;
  nonDuplicatesNumber: number;
  duplicatesSize: number;
  nonDuplictesSize: number;
};

const DuplicatesChart: FC<DuplicatesChartProps> = ({
  duplicatesNumber,
  nonDuplicatesNumber,
  duplicatesSize,
  nonDuplictesSize,
}) => {
  const { t } = useTranslation();
  const [targetItem, setTargetItem] = useState();

  const chartData = [
    {
      key: "duplicates",
      label: t("duplicates.duplicateElements"),
      value: duplicatesNumber,
      size: duplicatesSize,
    },
    {
      key: "nonDuplicates",
      label: t("duplicates.nonDuplicateElements"),
      value: nonDuplicatesNumber,
      size: nonDuplictesSize,
    },
  ];

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
          <div>{`${value} ${t("duplicates.elements")}`}</div>
          <div>{octet2HumanReadableFormat(size)}</div>
        </div>
      );
    },
    [chartData]
  );

  return (
    <Chart data={chartData} height={170}>
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
