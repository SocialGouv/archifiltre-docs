import { mkB } from "components/button";

const label = "METS";

const MetsButton = props => {
  const api = props.api;
  const database = api.database;
  const getOriginalPath = database.getOriginalPath;

  let button_is_enabled = true;
  if (getOriginalPath() === "") {
    button_is_enabled = false;
  }

  return mkB(
    () => {
      props.exportToMets(database.getState());
    },
    label,
    button_is_enabled,
    "#4d9e25",
    { width: "90%" }
  );
};

export default MetsButton;
