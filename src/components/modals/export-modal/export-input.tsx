import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaFolderOpen } from "react-icons/fa";
import { promptUserForSave } from "util/file-system/file-system-util";
import styled from "styled-components";

const FilePath = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 300px;
`;

const HideableTooltip = styled(Tooltip)<{ isVisible: boolean }>`
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
`;

type ExportInputProps = {
  exportFilePath: string;
  setExportsPathsValue: (value: string) => void;
  isFilePickerDisabled?: boolean;
};

const ExportInput: FC<ExportInputProps> = ({
  exportFilePath,
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
        <FilePath>{exportFilePath}</FilePath>
      </Tooltip>
      <HideableTooltip title={browseTitle} isVisible={!isFilePickerDisabled}>
        <Button onClick={onClick} disabled={isFilePickerDisabled}>
          <FaFolderOpen />
        </Button>
      </HideableTooltip>
    </Box>
  );
};

export default ExportInput;
