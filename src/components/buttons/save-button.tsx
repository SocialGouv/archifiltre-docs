import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import version from "../../version";
import Button, { ButtonWidth } from "../common/button";

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
  exportToJson,
}) => {
  const { t } = useTranslation();

  const onClick = useCallback(
    () => exportToJson({ originalPath, sessionName, version }),
    [exportToJson, originalPath, sessionName]
  );

  return (
    <Button
      id="json-export-button"
      onClick={onClick}
      width={ButtonWidth.WITH_SPACES}
    >
      {t("header.save")}
    </Button>
  );
};

export default SaveButton;
