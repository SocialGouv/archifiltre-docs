import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import type { TFunction } from "i18next";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { FileTypeMap } from "../../../../../exporters/audit/audit-report-values-computer";
import { colors } from "../../../../../utils/color";
import { octet2HumanReadableFormat } from "../../../../../utils/file-system/file-sys-util";
import { FileType } from "../../../../../utils/file-types";
import type {
  HorizontalStackedBarOption,
  RenderTooltipContent,
} from "../../../../common/horizontal-stacked-bar";
import { HorizontalStackedBar } from "../../../../common/horizontal-stacked-bar";

export interface FileTypesDetailsProps {
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
  (key) => {
    const typedKey = key as keyof typeof elementCountsByType;
    return (
      <Box>
        <Box>
          <Typography variant="body1">
            {t(`common.fileTypes.${key}`)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1">
            {elementCountsByType[typedKey]}{" "}
            {t(`common.file`, {
              count: elementCountsByType[typedKey],
            })}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1">
            {octet2HumanReadableFormat(elementSizesByType[typedKey])}
          </Typography>
        </Box>
      </Box>
    );
  };

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
      makeRenderTooltipContent(elementsCountsByType, elementsSizesByType, t),
    [elementsCountsByType, elementsSizesByType]
  );

  return (
    <HorizontalStackedBar
      data={elementsCountsByType}
      bars={bars}
      renderTooltipContent={renderTooltipContent}
    />
  );
};
