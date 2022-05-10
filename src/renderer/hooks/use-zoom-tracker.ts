import type { VoidFunction } from "@common/utils/function";
import { useState } from "react";

export const useZoomTracker = (): VoidFunction => {
  const [hasZoomBeenPerformed, setHasZoomBeenPerformed] = useState(false);
  return () => {
    if (!hasZoomBeenPerformed) {
      setHasZoomBeenPerformed(true);
    }
  };
};
