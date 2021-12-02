import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { ClickableIcon } from "components/common/clickable-icon";
import { EditableField } from "components/common/editable-field";
import { HelpTooltip } from "components/common/help-tooltip";
import { FOLDER_ICON, PAGE_ICON } from "components/common/icon";
import HashInfo from "components/main-space/workspace/enrichment/element-characteristics/hash-info";
import LastModifiedDate from "components/main-space/workspace/general/session-info/last-modified-date";
import { useStyles } from "hooks/use-styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import { openExternalElement } from "util/file-system/file-system-util";

import ElementCharacteristic from "./element-characteristic";

export interface ElementCharacteristicsContentProps {
    elementName: string;
    elementAlias: string;
    elementSize: number;
    elementPath: string;
    minLastModifiedTimestamp: number;
    maxLastModifiedTimestamp: number;
    medianLastModifiedTimestamp: number;
    lastModified: number;
    hash: string;
    isFolder: boolean;
    onElementNameChange: (name: string) => void;
    onLastModifiedChange: (timestamp: number) => void;
    type: string;
}

const ElementCharacteristicsContent: React.FC<
    ElementCharacteristicsContentProps
> = ({
    elementName,
    elementAlias,
    elementSize,
    elementPath,
    hash,
    isFolder,
    minLastModifiedTimestamp,
    maxLastModifiedTimestamp,
    medianLastModifiedTimestamp,
    lastModified,
    onLastModifiedChange,
    onElementNameChange,
    type,
}) => {
    const { t } = useTranslation();
    const { body2Box } = useStyles();

    const openElement = () => openExternalElement(elementPath);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
        >
            <Box marginY={0.5}>
                <Box display="flex">
                    <Box marginRight={2}>
                        <Box className={body2Box}>
                            {isFolder ? (
                                <ClickableIcon
                                    onClick={openElement}
                                    icon={FOLDER_ICON}
                                    color="black"
                                />
                            ) : (
                                <ClickableIcon
                                    onClick={openElement}
                                    icon={PAGE_ICON}
                                    color="black"
                                />
                            )}
                        </Box>
                    </Box>
                    {elementName !== "" && (
                        <Box width="100%">
                            <Box>
                                <EditableField
                                    trimValue={true}
                                    selectTextOnFocus={true}
                                    value={elementAlias || elementName}
                                    onChange={onElementNameChange}
                                />
                            </Box>
                            <Box>
                                <Typography variant="subtitle2">
                                    (
                                    {elementAlias
                                        ? elementName
                                        : t("report.initialName")}
                                    )
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
            <Box display="flex">
                <Box marginY={0.5} flex={1}>
                    <ElementCharacteristic
                        name={t("report.size")}
                        value={octet2HumanReadableFormat(elementSize)}
                    />
                    <ElementCharacteristic
                        name={
                            <>
                                {t("report.hash")}&nbsp;
                                <HelpTooltip
                                    tooltipText={
                                        isFolder
                                            ? t("report.folderHashExplanation")
                                            : t("report.fileHashExplanation")
                                    }
                                />
                            </>
                        }
                        value={<HashInfo hash={hash} />}
                    />
                </Box>
                <Box marginY={0.5} flex={1}>
                    <ElementCharacteristic
                        name={t("report.type")}
                        value={type}
                    />
                </Box>
            </Box>
            <Box marginY={0.5}>
                <Box>
                    <Typography variant="h5">
                        {t("report.lastModifications")}
                    </Typography>
                </Box>
                <LastModifiedDate
                    isFile={!isFolder}
                    lastModified={lastModified}
                    onDateChange={onLastModifiedChange}
                    minLastModifiedTimestamp={minLastModifiedTimestamp}
                    medianLastModifiedTimestamp={medianLastModifiedTimestamp}
                    maxLastModifiedTimestamp={maxLastModifiedTimestamp}
                />
            </Box>
        </Box>
    );
};

export default ElementCharacteristicsContent;
