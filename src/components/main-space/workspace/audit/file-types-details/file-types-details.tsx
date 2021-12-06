import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import type { TFunction } from "i18next";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { FileTypeMap } from "../../../../../exporters/audit/audit-report-values-computer";
import { colors } from "../../../../../util/color/color-util";
import { octet2HumanReadableFormat } from "../../../../../util/file-system/file-sys-util";
import { FileType } from "../../../../../util/file-types/file-types-util";
import type {
    HorizontalStackedBarOption,
    RenderTooltipContent,
} from "../../../../common/horizontal-stacked-bar";
import { HorizontalStackedBar } from "../../../../common/horizontal-stacked-bar";

interface FileTypesDetailsProps {
    elementsCountsByType: FileTypeMap<number>;
    elementsSizesByType: FileTypeMap<number>;
}

const makeBarConfig = (type: FileType): HorizontalStackedBarOption => ({
    color: colors[type],
    key: type,
});

const makeRenderTooltipContent =
    (
        elementCountsByType: FileTypeMap<number>,
        elementSizesByType: FileTypeMap<number>,
        t: TFunction
    ): RenderTooltipContent =>
    // eslint-disable-next-line react/display-name
    (key) =>
        (
            <Box>
                <Box>
                    <Typography variant="body1">
                        {t(`common.fileTypes.${key}`)}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body1">
                        {elementCountsByType[key]}{" "}
                        {t(`common.file`, { count: elementCountsByType[key] })}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body1">
                        {octet2HumanReadableFormat(elementSizesByType[key])}
                    </Typography>
                </Box>
            </Box>
        );

const bars = [
    makeBarConfig(FileType.PUBLICATION),
    makeBarConfig(FileType.PRESENTATION),
    makeBarConfig(FileType.SPREADSHEET),
    makeBarConfig(FileType.EMAIL),
    makeBarConfig(FileType.DOCUMENT),
    makeBarConfig(FileType.IMAGE),
    makeBarConfig(FileType.VIDEO),
    makeBarConfig(FileType.AUDIO),
    makeBarConfig(FileType.OTHER),
];

export const FileTypesDetails: React.FC<FileTypesDetailsProps> = ({
    elementsCountsByType,
    elementsSizesByType,
}) => {
    const { t } = useTranslation();

    const renderTooltipContent = useMemo(
        () =>
            makeRenderTooltipContent(
                elementsCountsByType,
                elementsSizesByType,
                t
            ),
        [elementsCountsByType, elementsSizesByType, t]
    );

    return (
        <HorizontalStackedBar
            data={elementsCountsByType}
            bars={bars}
            renderTooltipContent={renderTooltipContent}
        />
    );
};
