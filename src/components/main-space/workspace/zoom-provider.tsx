import { noop } from "lodash";
import React, { createContext, useCallback, useContext, useState } from "react";

import { useZoomTracker } from "../../../hooks/use-zoom-tracker";
import { ZoomDirection, zoomReducer } from "../../../util/zoom/zoom-util";

interface ZoomState {
  zoomIn: (mousePosition: number | null, zoomSpeed: number) => void;
  zoomOut: (mousePosition: number | null, zoomSpeed: number) => void;
  setZoom: (offset: number, ratio: number) => void;
  setDefaultMousePosition: (mousePosition: number | null) => void;
  resetZoom: () => void;
  ratio: number;
  offset: number;
}

const zoomState: ZoomState = {
  offset: 0,
  ratio: 1,
  resetZoom: noop,
  setDefaultMousePosition: noop,
  setZoom: noop,
  zoomIn: noop,
  zoomOut: noop,
};

const ZoomContext = createContext(zoomState);

export const useZoomContext = (): ZoomState => useContext(ZoomContext);

export const ZoomProvider: React.FC = ({ children }) => {
  const [ratio, setRatio] = useState(1);
  const [offset, setOffset] = useState(0);
  const [defaultMousePosition, setDefaultMousePosition] = useState<
    number | null
  >(null);
  const trackZoom = useZoomTracker();
  const viewPortCenter = offset + 1 / (2 * ratio);

  const applyZoom = useCallback(
    (zoomDirection, mousePosition, zoomSpeed) => {
      trackZoom();
      const zoomStateToApply = {
        offset,
        ratio,
      };
      const zoomAction = {
        mousePosition,
        zoomDirection,
        zoomSpeed,
      };
      const { offset: nextOffset, ratio: nextRatio } = zoomReducer(
        zoomStateToApply,
        zoomAction
      );
      setOffset(nextOffset);
      setRatio(nextRatio);
    },
    [ratio, offset, setRatio, setOffset, trackZoom]
  );

  const setZoom: ZoomState["setZoom"] = useCallback(
    (toSetOffset, toSetRatio) => {
      setOffset(toSetOffset);
      setRatio(toSetRatio);
    },
    [setOffset, setRatio]
  );

  const zoomIn = useCallback(
    (mousePosition, zoomSpeed) => {
      applyZoom(
        ZoomDirection.IN,
        mousePosition || defaultMousePosition || viewPortCenter,
        zoomSpeed
      );
    },
    [applyZoom, defaultMousePosition, viewPortCenter]
  );

  const zoomOut = useCallback(
    (mousePosition, zoomSpeed) => {
      applyZoom(
        ZoomDirection.OUT,
        mousePosition || defaultMousePosition || viewPortCenter,
        zoomSpeed
      );
    },
    [applyZoom, defaultMousePosition, viewPortCenter]
  );

  const resetZoom = useCallback(() => {
    setZoom(0, 1);
  }, [setZoom]);

  return (
    <ZoomContext.Provider
      value={{
        offset,
        ratio,
        resetZoom,
        setDefaultMousePosition,
        setZoom,
        zoomIn,
        zoomOut,
      }}
    >
      {children}
    </ZoomContext.Provider>
  );
};
