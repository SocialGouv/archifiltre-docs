import React, { FC, useCallback, useEffect } from "react";

import { mkRB } from "components/buttons/button";
import { FaUndo, FaRedo } from "react-icons/fa";

interface UndoRedoProps {
  isVisible: boolean;
  api: any;
}

const UndoRedo: FC<UndoRedoProps> = ({ isVisible, api }) => {
  const onKeyDownHandler = useCallback((event) => {
    if (event.ctrlKey === true) {
      if (event.key === "z") {
        this.props.api.undo.undo();
      } else if (event.key === "Z") {
        this.props.api.undo.redo();
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
    <div className="grid-x grid-padding-x">
      <div className="cell small-5">
        {mkRB(
          api.undo.undo,
          <FaUndo style={{ width: "100%", height: "100%" }} />,
          api.undo.hasAPast(),
          "",
          { width: "45px", height: "45px" }
        )}
      </div>
      <div className="cell small-5">
        {mkRB(
          api.undo.redo,
          <FaRedo style={{ width: "100%", height: "100%" }} />,
          api.undo.hasAFuture(),
          "",
          {
            width: "45px",
            height: "45px",
          }
        )}
      </div>
    </div>
  );
};

export default UndoRedo;
