import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import React, { FC, useCallback, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { FaUndo, FaRedo } from "react-icons/fa";
import { useStyles } from "hooks/use-styles";

interface UndoRedoButtonProps {
  isVisible: boolean;
  api: any;
  isUndo?: boolean;
}

const UndoRedoButton: FC<UndoRedoButtonProps> = ({
  isVisible,
  api,
  isUndo = true,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const onKeyDownHandler = useCallback(({ ctrlKey, key }) => {
    if (ctrlKey) {
      if (key === "z") {
        api.undo.undo();
      } else if (key === "Z") {
        api.undo.redo();
      }
    }
  }, []);

  useEffect(() => {
    document.body.addEventListener("keydown", onKeyDownHandler, false);
    return () =>
      document.body.removeEventListener("keydown", onKeyDownHandler, false);
  });

  if (!isVisible) return null;
  const title = isUndo ? t("header.undo") : t("header.redo");
  return (
    <Tooltip title={title}>
      <span>
        <Button
          id={isUndo ? "undo-button" : "redo-button"}
          color="primary"
          variant="contained"
          className={classes.headerButton}
          onClick={isUndo ? api.undo.undo : api.undo.redo}
          disabled={isUndo ? !api.undo.hasAPast() : !api.undo.hasAFuture()}
          disableElevation
        >
          {isUndo ? <FaUndo /> : <FaRedo />}
        </Button>
      </span>
    </Tooltip>
  );
};

export default UndoRedoButton;
