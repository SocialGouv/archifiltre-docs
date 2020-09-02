import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaSave } from "react-icons/fa";
import { useStyles } from "hooks/use-styles";
import version from "../../version";

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
  const classes = useStyles();

  const onClick = useCallback(
    () => exportToJson({ originalPath, sessionName, version }),
    [exportToJson, originalPath, sessionName]
  );
  const title = t("header.save");
  return (
    <Tooltip title={title}>
      <Button
        id="json-export-button"
        color="primary"
        variant="contained"
        className={classes.headerButton}
        onClick={onClick}
        disableElevation
      >
        <FaSave />
      </Button>
    </Tooltip>
  );
};

export default SaveButton;
