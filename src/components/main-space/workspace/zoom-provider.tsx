import { useZoomTracker } from "hooks/use-zoom-tracker";
import type { FC } from "react";
import React, { useCallback, useContext, useState } from "react";
import { empty } from "util/function/function-util";
import { ZoomDirection, zoomReducer } from "util/zoom/zoom-util";

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
    resetZoom: empty,
    setDefaultMousePosition: (mousePosition) => {},
    setZoom: (offset, ratio) => {},
    zoomIn: (mousePosition, zoomSpeed) => {},
    zoomOut: (mousePosition, zoomSpeed) => {},
};

const ZoomContext = React.createContext(zoomState);

export const useZoomContext = () => useContext(ZoomContext);

const ZoomProvider: FC = ({ children }) => {
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

export default ZoomProvider;
