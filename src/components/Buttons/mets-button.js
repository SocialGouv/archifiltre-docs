import { mkB } from "components/Buttons/button";

const label = "METS \uD83E\uDD7C"; // \u{1F97C} labcoat or \u{1F9EA} test-tube

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
