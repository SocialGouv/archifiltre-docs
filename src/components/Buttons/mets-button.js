import { mkB } from "components/Buttons/button";
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
      exportToMets(database.getState());
    },
    label,
    isButtonEnabled,
    "#4d9e25",
    { width: "90%" }
  );
};

export default MetsButton;
