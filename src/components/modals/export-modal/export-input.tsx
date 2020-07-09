import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaFolderOpen } from "react-icons/fa";
import { promptUserForSave } from "util/file-system/file-system-util";
import styled from "styled-components";

const FileOpenerButton = styled(FaFolderOpen)`
  padding-left: 5px;
  cursor: pointer;
`;

const FilePath = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 300px;
`;

type ExportInputProps = {
  exportFilePath: string;
  setExportsPathsValue: (value: string) => void;
};

const ExportInput: FC<ExportInputProps> = ({
  exportFilePath,
  setExportsPathsValue,
}) => {
  const { t } = useTranslation();
  const onClick = useCallback(async () => {
    const filePath = await promptUserForSave(exportFilePath);
    if (filePath) {
      setExportsPathsValue(filePath);
    }
  }, []);

  const browseTitle = t("common.browse");

  return (
    <Box display="flex" alignItems="center">
      <Tooltip title={exportFilePath}>
        <FilePath>{exportFilePath}</FilePath>
      </Tooltip>
      <Tooltip title={browseTitle}>
        <span>
          <FileOpenerButton onClick={onClick} />
        </span>
      </Tooltip>
    </Box>
  );
};

export default ExportInput;
