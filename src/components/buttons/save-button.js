import { mkB } from "components/buttons/button";

import { save, makeNameWithExt } from "util/file-sys-util";

import { useTranslation } from "react-i18next";

const SaveButton = props => {
  const api = props.api;
  const database = api.database;
  const getJson = database.toJson;
  const getSessionName = database.getSessionName;
  const { t } = useTranslation();
  const name = () => makeNameWithExt(getSessionName(), "json");
  return mkB(
    () => {
      save(name(), getJson());
    },
    t("header.save"),
    true,
    "#4d9e25",
    { width: "90%" }
  );
};

export default SaveButton;
