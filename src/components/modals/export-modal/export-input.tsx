import React, { FC, useCallback } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { promptUserForSave } from "util/file-system/file-system-util";

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
    <div>
      <span>{exportFilePath}</span>
      <FaEllipsisH onClick={onClick} />
    </div>
  );
};

export default ExportInput;
