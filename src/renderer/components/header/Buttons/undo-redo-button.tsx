import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaRedo, FaUndo } from "react-icons/fa";

import { useStyles } from "../../../hooks/use-styles";

export interface UndoRedoButtonProps {
  isActive: boolean;
  isUndo?: boolean;
  isVisible: boolean;
  redo: () => void;
  undo: () => void;
}

export const UndoRedoButton: React.FC<UndoRedoButtonProps> = ({ isVisible, isUndo = true, undo, redo, isActive }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  // TODO: use electron built-in menu undo/redo instead
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
    [undo, redo],
  );

  useEffect(() => {
    document.body.addEventListener("keydown", onKeyDownHandler, false);
    return () => {
      document.body.removeEventListener("keydown", onKeyDownHandler, false);
    };
  });

  if (!isVisible) return null;
  const title = isUndo ? t("header.undo") : t("header.redo");
  return (
    <Tooltip title={title}>
      <span>
        <Button
          id={isUndo ? "undo-button" : "redo-button"}
          color="primary"
          variant="outlined"
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
