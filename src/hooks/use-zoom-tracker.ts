import { useState } from "react";
import { addTracker } from "../logging/tracker";
import { ActionTitle, ActionType } from "../logging/tracker-types";

export const useZoomTracker = () => {
  const [hasZoomBeenPerformed, setHasZoomBeenPerformed] = useState(false);
  return () => {
    if (!hasZoomBeenPerformed) {
      addTracker({
        title: ActionTitle.ZOOM_PERFORMED,
        type: ActionType.TRACK_EVENT,
      });
      setHasZoomBeenPerformed(true);
    }
  };
};