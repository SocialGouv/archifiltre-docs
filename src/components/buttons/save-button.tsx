import { mkB } from "components/buttons/button";

import { FC } from "react";
import { useTranslation } from "react-i18next";
import version from "../../version";

interface ExportToJsonOptions {
  sessionName: string;
  originalPath: string;
  version: string;
}

export type ExportToJson = (options: ExportToJsonOptions) => void;

interface SaveButtonProps {
  api: any;
  originalPath: string;
  sessionName: string;
  exportToJson: ExportToJson;
}

const SaveButton: FC<SaveButtonProps> = ({
  originalPath,
  sessionName,
  exportToJson
}) => {
  const { t } = useTranslation();

  return mkB(
    () => {
      exportToJson({
        originalPath,
        sessionName,
        version
      });
    },
    t("header.save"),
    true,
    "#4d9e25",
    { width: "90%" }
  );
};

export default SaveButton;
