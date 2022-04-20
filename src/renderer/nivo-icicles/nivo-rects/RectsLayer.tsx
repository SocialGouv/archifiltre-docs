import type { InheritedColorConfig } from "@nivo/colors";
import React, { createElement } from "react";

import type { RectMouseHandler, RectShapeProps } from "./RectShape";
import { RectShape } from "./RectShape";
import type { DatumWithRectAndColor } from "./types";
import { useRectsTransition } from "./useRectsTransition";

export type RectComponent<TDatum extends DatumWithRectAndColor> = (
  props: RectShapeProps<TDatum>
) => JSX.Element;

interface RectsLayerProps<TDatum extends DatumWithRectAndColor> {
  borderColor: InheritedColorConfig<TDatum>;
  borderWidth: number;
  component?: RectComponent<TDatum>;
  data: TDatum[];
  onClick?: RectMouseHandler<TDatum>;
  onMouseEnter?: RectMouseHandler<TDatum>;
  onMouseLeave?: RectMouseHandler<TDatum>;
  onMouseMove?: RectMouseHandler<TDatum>;
}

export const RectsLayer = <TDatum extends DatumWithRectAndColor>({
  // borderColor,
  onMouseMove,
  onMouseLeave,
  onMouseEnter,
  onClick,
  borderWidth,
  data,
  component = RectShape,
}: RectsLayerProps<TDatum>): JSX.Element => {
  // const theme = useTheme();
  // const getBorderColor = useInheritedColor<TDatum>(borderColor, theme);

  const { transition } = useRectsTransition<
    TDatum,
    { borderColor: string; color: string; opacity: number }
  >(data, {
    enter: (datum) => ({
      // borderColor: getBorderColor(datum),
      borderColor: "#ccc",

      color: datum.color,

      opacity: 0,
    }),
    leave: (datum) => ({
      // borderColor: getBorderColor(datum),
      borderColor: "#ccc",

      color: datum.color,

      opacity: 0,
    }),
    update: (datum) => ({
      // borderColor: getBorderColor(datum),
      borderColor: "#ccc",

      color: datum.color,

      opacity: 1,
    }),
  });

  const Rect: RectComponent<TDatum> = component;

  return (
    <g>
      {transition((transitionProps, datum) => {
        return createElement(Rect, {
          datum,
          key: datum.id,
          onClick,
          onMouseEnter,
          onMouseLeave,
          onMouseMove,
          style: {
            ...transitionProps,
            borderWidth,
            height: datum.rect.height,
            transform: datum.rect.transform,
            width: datum.rect.width,
          },
        });
      })}
    </g>
  );
};
