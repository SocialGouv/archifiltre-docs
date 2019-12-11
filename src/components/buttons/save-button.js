import { mkB } from "components/buttons/button";

import { useTranslation } from "react-i18next";

const SaveButton = ({ api, exportToJson }) => {
  const { t } = useTranslation();

  const { getOriginalPath, getSessionName, getVersion } = api.database;

  return mkB(
    () => {
      exportToJson({
        sessionName: getSessionName(),
        originalPath: getOriginalPath(),
        version: getVersion()
      });
    },
    t("header.save"),
    true,
    "#4d9e25",
    { width: "90%" }
  );
};

export default SaveButton;
