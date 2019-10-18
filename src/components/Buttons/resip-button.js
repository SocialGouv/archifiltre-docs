import { mkB } from "components/Buttons/button";
import path from "path";

import { makeNameWithExt } from "../../util/file-sys-util";

const label = "RESIP";

const ResipButton = props => {
  const {
    exportToResip,
    api: {
      database: { getSessionName, getOriginalPath }
    }
  } = props;

  const savePath = path.join(getOriginalPath(), `${getSessionName()}-RESIP`);

  const name = makeNameWithExt(savePath, "csv");

  return mkB(
    () => {
      exportToResip(name);
    },
    label,
    true,
    "#4d9e25",
    { width: "90%" }
  );
};

export default ResipButton;
