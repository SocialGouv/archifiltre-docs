import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaSave } from "react-icons/fa";
import version from "../../version";
import Button, { ButtonWidth } from "../common/button";

interface ExportToJsonOptions {
  sessionName: string;
  originalPath: string;
  version: string;
}

export type ExportToJson = (options: ExportToJsonOptions) => void;

interface SaveButtonProps {
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
      tooltipText={t("header.save")}
    >
      <FaSave />
    </Button>
  );
};

export default SaveButton;
