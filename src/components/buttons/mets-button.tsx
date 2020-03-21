import React, { FC, useCallback } from "react";
import Button from "../common/button";

const metsButtonLabel = (
  <span>
    METS <small>beta</small>
  </span>
);

interface ExportToMetsOptions {
  originalPath: string;
  sessionName: string;
}

export type ExportToMets = (options: ExportToMetsOptions) => void;

interface MetsButtonProps {
  exportToMets: ExportToMets;
  originalPath: string;
  sessionName: string;
}

const MetsButton: FC<MetsButtonProps> = ({
  exportToMets,
  originalPath,
  sessionName,
}) => {
  const isDisabled = originalPath === "";

  const onClick = useCallback(() => {
    exportToMets({
      originalPath,
      sessionName,
    });
  }, [exportToMets, originalPath, sessionName]);

  return (
    <Button id="mets-export-button" onClick={onClick} disabled={isDisabled}>
      {metsButtonLabel}
    </Button>
  );
};

export default MetsButton;
