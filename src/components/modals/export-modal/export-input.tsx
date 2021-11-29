import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import withTheme from "@material-ui/core/styles/withTheme";
import Tooltip from "@material-ui/core/Tooltip";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaFolderOpen } from "react-icons/fa";
import styled from "styled-components";
import type { ThemedProps } from "theme/default-theme";
import { promptUserForSave } from "util/file-system/file-system-util";

const FilePath = withTheme(styled.span<ThemedProps & { hasError: boolean }>`
    white-space: nowrap;
    overflow: hidden;
    width: 300px;
    direction: rtl;
    text-overflow: ellipsis;
    color: ${({ hasError, theme }) =>
        hasError ? theme.palette.error.main : "inherit"};
`);

const HideableTooltip = styled(Tooltip)<{ isvisible: string }>`
    visibility: ${({ isvisible }) =>
        isvisible === "true" ? "visible" : "hidden"};
`;

interface ExportInputProps {
    exportFilePath: string;
    isValid: boolean;
    setExportsPathsValue: (value: string) => void;
    isFilePickerDisabled?: boolean;
}

const ExportInput: React.FC<ExportInputProps> = ({
    exportFilePath,
    isValid,
    setExportsPathsValue,
    isFilePickerDisabled = false,
}) => {
    const { t } = useTranslation();
    const onClick = useCallback(async () => {
        const filePath = await promptUserForSave(exportFilePath);
        if (filePath) {
            setExportsPathsValue(filePath);
        }
    }, [setExportsPathsValue]);

    const browseTitle = t("common.browse");

    return (
        <Box display="flex" alignItems="center">
            <Tooltip title={exportFilePath}>
                <FilePath hasError={!isValid}>{exportFilePath}</FilePath>
            </Tooltip>
            <HideableTooltip
                title={browseTitle}
                isvisible={(!isFilePickerDisabled).toString()}
            >
                <Box paddingLeft={1}>
                    <IconButton
                        size="small"
                        color="secondary"
                        onClick={onClick}
                        disabled={isFilePickerDisabled}
                    >
                        <FaFolderOpen />
                    </IconButton>
                </Box>
            </HideableTooltip>
        </Box>
    );
};

export default ExportInput;
