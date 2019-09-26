import { mkB } from "components/button";

import { save, makeNameWithExt } from "util/file-sys-util";

import pick from "languages";

const label = pick({
  en: "Save",
  fr: "Enregistrer"
});

const SaveButton = props => {
  const api = props.api;
  const database = api.database;
  const getJson = database.toJson;
  const getSessionName = database.getSessionName;

  const name = () => makeNameWithExt(getSessionName(), "json");
  return mkB(
    () => {
      save(name(), getJson());
    },
    label,
    true,
    "#4d9e25",
    { width: "90%" }
  );
};

export default SaveButton;
