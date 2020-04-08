import React, { FC, useCallback, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { FaUndo, FaRedo } from "react-icons/fa";
import Button, { ButtonWidth } from "../../common/button";

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

  return (
    <Button
      id={isUndo ? "undo-button" : "redo-button"}
      width={ButtonWidth.WITH_SPACES}
      onClick={isUndo ? api.undo.undo : api.undo.redo}
      disabled={isUndo ? !api.undo.hasAPast() : !api.undo.hasAFuture()}
      tooltipText={isUndo ? t("header.undo") : t("header.redo")}
    >
      {isUndo ? <FaUndo /> : <FaRedo />}
    </Button>
  );
};

export default UndoRedoButton;
