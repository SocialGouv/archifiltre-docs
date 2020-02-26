import path from "path";
import React, { FC, useCallback } from "react";
import { makeNameWithExt } from "../../util/file-sys-util";
import Button from "../common/button";

const label = "RESIP";

export type ExportToResip = (name: string) => void;

interface ResipButtonProps {
  originalPath: string;
  sessionName: string;
  exportToResip: ExportToResip;
}

const ResipButton: FC<ResipButtonProps> = ({
  originalPath,
  sessionName,
  exportToResip
}) => {
  const savePath = path.join(originalPath, `${sessionName}-RESIP`);

  const name = makeNameWithExt(savePath, "csv");

  const onClick = useCallback(() => {
    exportToResip(name);
  }, [exportToResip, name]);

  return (
    <Button id="resip-button" onClick={onClick}>
      {label}
    </Button>
  );
};

export default ResipButton;
