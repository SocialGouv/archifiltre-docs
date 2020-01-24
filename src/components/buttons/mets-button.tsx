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
  api: any;
}

const MetsButton: FC<MetsButtonProps> = ({
  exportToMets,
  api: { database }
}) => {
  const isButtonEnabled = database.getOriginalPath() !== "";

  return mkB(
    () => {
      const originalPath = database.getOriginalPath();
      const sessionName = database.getSessionName();
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
