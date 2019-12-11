import { mkB } from "components/buttons/button";
import React from "react";

const label = (
  <span>
    METS <small>beta</small>
  </span>
);

const MetsButton = props => {
  const {
    exportToMets,
    api: { database }
  } = props;

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
    label,
    isButtonEnabled,
    "#4d9e25",
    { width: "90%" }
  );
};

export default MetsButton;
