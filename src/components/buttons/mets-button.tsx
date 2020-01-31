import { mkB } from "components/buttons/button";
import React, { FC } from "react";

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
  sessionName
}) => {
  const isButtonEnabled = originalPath !== "";

  return mkB(
    () => {
      exportToMets({
        originalPath,
        sessionName
      });
    },
    metsButtonLabel,
    isButtonEnabled,
    "#4d9e25",
    { width: "90%" }
  );
};

export default MetsButton;
