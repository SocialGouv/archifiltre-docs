import { mkB } from "components/Buttons/button";

import { makeNameWithExt } from "../../util/file-sys-util";

const label = "RESIP";

const ResipButton = props => {
  const {
    exportToResip,
    api: {
      database: { getSessionName }
    }
  } = props;
  const name = makeNameWithExt(`${getSessionName()}-RESIP`, "csv");

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
