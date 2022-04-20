import { useTheme } from "@nivo/core";
import type { SpringValue } from "@react-spring/web";
import { animated } from "@react-spring/web";
import type { CSSProperties } from "react";
import React from "react";

import type { DatumWithRectAndColor } from "../types";

const staticStyle: CSSProperties = {
  pointerEvents: "none",
};

export interface RectLabelProps<TDatum extends DatumWithRectAndColor> {
  datum: TDatum;
  label: string;
  style: {
    progress: SpringValue<number>;
    textColor: string;
  };
}

export const RectLabel = <TDatum extends DatumWithRectAndColor>({
  label,
  style,
}: RectLabelProps<TDatum>): JSX.Element => {
  const theme = useTheme();

  return (
    <animated.g opacity={style.progress} style={staticStyle}>
      <animated.text
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          ...theme.labels.text,
          fill: style.textColor,
        }}
      >
        {label}
      </animated.text>
    </animated.g>
  );
};
