import { useTooltip } from "@nivo/tooltip";
import { createElement, useMemo } from "react";
import * as React from "react";

import { RectsLayer } from "./nivo-rects/RectsLayer";
import type {
  IciclesCommonProps,
  IciclesComputedDatum,
  IciclesMouseHandlers,
} from "./types";

interface RectsProps<TRawDatum> {
  borderColor: IciclesCommonProps<TRawDatum>["borderColor"];
  borderWidth: IciclesCommonProps<TRawDatum>["borderWidth"];
  data: IciclesComputedDatum<TRawDatum>[];
  isInteractive: IciclesCommonProps<TRawDatum>["isInteractive"];
  onClick?: IciclesMouseHandlers<TRawDatum>["onClick"];
  onMouseEnter?: IciclesMouseHandlers<TRawDatum>["onMouseEnter"];
  onMouseLeave?: IciclesMouseHandlers<TRawDatum>["onMouseLeave"];
  onMouseMove?: IciclesMouseHandlers<TRawDatum>["onMouseMove"];
  tooltip: IciclesCommonProps<TRawDatum>["tooltip"];
}

export const Rects = <TRawDatum,>({
  data,
  borderWidth,
  borderColor,
  isInteractive,
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  tooltip,
}: RectsProps<TRawDatum>): JSX.Element => {
  const { showTooltipFromEvent, hideTooltip } = useTooltip();

  const handleClick = useMemo(() => {
    if (!isInteractive) return undefined;

    return (
      datum: IciclesComputedDatum<TRawDatum>,
      event: React.MouseEvent<SVGPathElement>
    ) => {
      onClick?.(datum, event);
    };
  }, [isInteractive, onClick]);

  const handleMouseEnter = useMemo(() => {
    if (!isInteractive) return undefined;

    return (
      datum: IciclesComputedDatum<TRawDatum>,
      event: React.MouseEvent<SVGPathElement>
    ) => {
      showTooltipFromEvent(createElement(tooltip, datum), event);
      onMouseEnter?.(datum, event);
    };
  }, [isInteractive, showTooltipFromEvent, tooltip, onMouseEnter]);

  const handleMouseMove = useMemo(() => {
    if (!isInteractive) return undefined;

    return (
      datum: IciclesComputedDatum<TRawDatum>,
      event: React.MouseEvent<SVGPathElement>
    ) => {
      showTooltipFromEvent(createElement(tooltip, datum), event);
      onMouseMove?.(datum, event);
    };
  }, [isInteractive, showTooltipFromEvent, tooltip, onMouseMove]);

  const handleMouseLeave = useMemo(() => {
    if (!isInteractive) return undefined;

    return (
      datum: IciclesComputedDatum<TRawDatum>,
      event: React.MouseEvent<SVGPathElement>
    ) => {
      hideTooltip();
      onMouseLeave?.(datum, event);
    };
  }, [isInteractive, hideTooltip, onMouseLeave]);

  return (
    <RectsLayer<IciclesComputedDatum<TRawDatum>>
      data={data}
      borderWidth={borderWidth}
      borderColor={borderColor}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
};
