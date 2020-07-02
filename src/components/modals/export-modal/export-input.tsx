import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import React, { FC, useCallback } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { promptUserForSave } from "util/file-system/file-system-util";
import styled from "styled-components";

const FileOpenerButton = styled(FaEllipsisH)`
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
  const onClick = useCallback(async () => {
    const filePath = await promptUserForSave(exportFilePath);
    if (filePath) {
      setExportsPathsValue(filePath);
    }
  }, []);

  return (
    <Box display="flex" alignItems="center">
      <Tooltip title={exportFilePath}>
        <FilePath>{exportFilePath}</FilePath>
      </Tooltip>
      <FileOpenerButton onClick={onClick} />
    </Box>
  );
};

export default ExportInput;
