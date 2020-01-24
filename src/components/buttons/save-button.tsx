import { mkB } from "components/buttons/button";

import { FC } from "react";
import { useTranslation } from "react-i18next";

interface ExportToJsonOptions {
  sessionName: string;
  originalPath: string;
  version: string;
}

export type ExportToJson = (options: ExportToJsonOptions) => void;

interface SaveButtonProps {
  api: any;
  exportToJson: ExportToJson;
}

const SaveButton: FC<SaveButtonProps> = ({ api, exportToJson }) => {
  const { t } = useTranslation();

  const { getOriginalPath, getSessionName, getVersion } = api.database;

  return mkB(
    () => {
      exportToJson({
        originalPath: getOriginalPath(),
        sessionName: getSessionName(),
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
