import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import React, { FC, useCallback, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { FaUndo, FaRedo } from "react-icons/fa";
import { useStyles } from "hooks/use-styles";

interface UndoRedoButtonProps {
  isVisible: boolean;
  isUndo?: boolean;
  undo: () => void;
  redo: () => void;
  isActive: boolean;
}

const UndoRedoButton: FC<UndoRedoButtonProps> = ({
  isVisible,
  isUndo = true,
  undo,
  redo,
  isActive,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const onKeyDownHandler = useCallback(
    ({ ctrlKey, key }) => {
      if (ctrlKey) {
        if (key === "z") {
          undo();
        } else if (key === "Z") {
          redo();
        }
      }
    },
    [undo, redo]
  );

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
          onClick={isUndo ? undo : redo}
          disabled={!isActive}
          disableElevation
        >
          {isUndo ? <FaUndo /> : <FaRedo />}
        </Button>
      </span>
    </Tooltip>
  );
};

export default UndoRedoButton;
