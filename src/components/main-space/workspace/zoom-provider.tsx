import React, { FC, useCallback, useContext, useState } from "react";
import { empty } from "util/function/function-util";
import { ZoomDirection, zoomReducer } from "util/zoom/zoom-util";

const zoomState = {
  zoomIn: (mousePosition, zoomSpeed) => {},
  zoomOut: (mousePosition, zoomSpeed) => {},
  setZoom: (offset, ratio) => {},
  resetZoom: empty,
  ratio: 1,
  offset: 0,
};

const ZoomContext = React.createContext(zoomState);

export const useZoomContext = () => useContext(ZoomContext);

const ZoomProvider: FC = ({ children }) => {
  const [ratio, setRatio] = useState(1);
  const [offset, setOffset] = useState(0);

  const applyZoom = useCallback(
    (zoomDirection, mousePosition, zoomSpeed) => {
      const zoomState = {
        offset,
        ratio,
      };
      const zoomAction = {
        mousePosition,
        zoomDirection,
        zoomSpeed,
      };
      const { offset: nextOffset, ratio: nextRatio } = zoomReducer(
        zoomState,
        zoomAction
      );
      setOffset(nextOffset);
      setRatio(nextRatio);
    },
    [ratio, offset, setRatio, setOffset]
  );

  const setZoom = useCallback(
    (offset, ratio) => {
      setOffset(offset);
      setRatio(ratio);
    },
    [setOffset, setRatio]
  );

  const zoomIn = useCallback(
    (mousePosition, zoomSpeed) => {
      applyZoom(ZoomDirection.IN, mousePosition, zoomSpeed);
    },
    [applyZoom]
  );

  const zoomOut = useCallback(
    (mousePosition, zoomSpeed) => {
      applyZoom(ZoomDirection.OUT, mousePosition, zoomSpeed);
    },
    [applyZoom]
  );

  const resetZoom = useCallback(() => {
    setZoom(0, 1);
  }, [setZoom]);

  return (
    <ZoomContext.Provider
      value={{
        zoomIn,
        zoomOut,
        resetZoom,
        setZoom,
        ratio,
        offset,
      }}
    >
      {children}
    </ZoomContext.Provider>
  );
};

export default ZoomProvider;
