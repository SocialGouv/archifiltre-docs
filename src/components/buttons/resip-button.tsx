import { mkB } from "components/buttons/button";
import path from "path";
import { FC } from "react";
import { makeNameWithExt } from "../../util/file-sys-util";

const label = "RESIP";

export type ExportToResip = (name: string) => void;

interface ResipButtonProps {
  api: any;
  exportToResip: ExportToResip;
}

const ResipButton: FC<ResipButtonProps> = ({
  exportToResip,
  api: {
    database: { getSessionName, getOriginalPath }
  }
}) => {
  const savePath = path.join(getOriginalPath(), `${getSessionName()}-RESIP`);

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
