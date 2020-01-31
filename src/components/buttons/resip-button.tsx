import { mkB } from "components/buttons/button";
import path from "path";
import { FC } from "react";
import { makeNameWithExt } from "../../util/file-sys-util";

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

  return mkB(
    () => {
      exportToResip(name);
    },
    label,
    true,
    "#4d9e25",
    { width: "90%" },
    "resip-button"
  );
};

export default ResipButton;
