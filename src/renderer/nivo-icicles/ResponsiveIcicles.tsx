import { ResponsiveWrapper } from "@nivo/core";
import React from "react";

import { Icicles } from "./Icicles";
import type { IciclesSvgProps } from "./types";

type ResponsiveIciclesProps<TRawDatum> = Partial<
  Omit<IciclesSvgProps<TRawDatum>, "data" | "height" | "width">
> &
  Pick<IciclesSvgProps<TRawDatum>, "data">;

export const ResponsiveIcicles = <TRawDatum,>(
  props: ResponsiveIciclesProps<TRawDatum>
): JSX.Element => (
  <ResponsiveWrapper>
    {({ width, height }: { height: number; width: number }) => (
      <Icicles<TRawDatum> width={width} height={height} {...props} />
    )}
  </ResponsiveWrapper>
);
