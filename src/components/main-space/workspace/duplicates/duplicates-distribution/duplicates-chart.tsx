import { EventTracker, Palette } from "@devexpress/dx-react-chart";
import {
    Chart,
    PieSeries,
    Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import grey from "@material-ui/core/colors/grey";
import orange from "@material-ui/core/colors/orange";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";

const ColoredText = styled.span<{ color: string }>`
    display: block;
    color: ${({ color }) => color};
`;

const scheme = [orange["500"], grey["500"]];

interface DuplicatesChartProps {
    duplicatesNumber: number;
    nonDuplicatesNumber: number;
    duplicatesSize: number;
    nonDuplicatesSize: number;
}

const DuplicatesChart: React.FC<DuplicatesChartProps> = ({
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
        [
            duplicatesNumber,
            duplicatesSize,
            nonDuplicatesNumber,
            nonDuplicatesSize,
        ]
    );

    const onTargetItemChange = useCallback(
        (newTargetItem) => {
            setTargetItem(newTargetItem);
        },
        [setTargetItem]
    );

    const getTooltipContent = useCallback(
        ({ targetItem: { point } }) => {
            const { label, value, size } = chartData[point];
            return (
                <div>
                    <div>{label}</div>
                    <ColoredText color={scheme[point]}>{`${value} ${t(
                        "duplicates.elements"
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
            <PieSeries
                valueField="value"
                argumentField="key"
                innerRadius={0.6}
            />
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
