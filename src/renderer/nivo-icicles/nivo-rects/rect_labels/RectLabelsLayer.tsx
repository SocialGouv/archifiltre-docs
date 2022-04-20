import { useInheritedColor } from "@nivo/colors";
import type { PropertyAccessor } from "@nivo/core";
import { usePropertyAccessor, useTheme } from "@nivo/core";
import React, { createElement } from "react";

import type { DatumWithRectAndColor } from "../types";
import { useRectsTransition } from "../useRectsTransition";
import type { RectLabelsProps } from "./props";
import type { RectLabelProps } from "./RectLabel";
import { RectLabel } from "./RectLabel";

export type RectLabelComponent<TDatum extends DatumWithRectAndColor> = (
  props: RectLabelProps<TDatum>
) => JSX.Element;

interface RectLabelsLayerProps<TDatum extends DatumWithRectAndColor> {
  component?: RectLabelsProps<TDatum>["rectLabelsComponent"];
  data: TDatum[];
  label: PropertyAccessor<TDatum, string>;
  textColor: RectLabelsProps<TDatum>["rectLabelsTextColor"];
}

export const RectLabelsLayer = <TDatum extends DatumWithRectAndColor>({
  data,
  label: labelAccessor,
  textColor,
  component = RectLabel,
}: RectLabelsLayerProps<TDatum>): JSX.Element => {
  const getLabel = usePropertyAccessor<TDatum, string>(labelAccessor);
  const theme = useTheme();
  const getTextColor = useInheritedColor<TDatum>(textColor, theme);

  // const filteredData = useMemo(() => {}, [])

  const { transition } = useRectsTransition<TDatum>(data);

  const Label: RectLabelComponent<TDatum> = component;

  return (
    <g>
      {transition((transitionProps, datum) => {
        return createElement(Label, {
          datum,
          key: datum.id,
          label: getLabel(datum),
          style: {
            ...transitionProps,
            textColor: getTextColor(datum),
          },
        });
      })}
    </g>
  );
};
