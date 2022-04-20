import { useMotionConfig } from "@nivo/core";
import type { PickAnimated, TransitionFn } from "@react-spring/web";
import { useTransition } from "@react-spring/web";
import { useMemo } from "react";

import type { DatumWithRect, DatumWithRectAndColor } from "./types";

export interface TransitionExtra<TDatum extends DatumWithRect, TExtraProps> {
  enter: (datum: TDatum) => TExtraProps;
  leave: (datum: TDatum) => TExtraProps;
  update: (datum: TDatum) => TExtraProps;
}
const useRectExtraTransition = <
  TDatum extends DatumWithRectAndColor,
  TExtraProps
>(
  extraTransition?: TransitionExtra<TDatum, TExtraProps>
) =>
  useMemo(
    () => ({
      enter: (datum: TDatum) => ({
        progress: 0,
        ...(extraTransition?.enter(datum) ?? {}),
      }),
      leave: (datum: TDatum) => ({
        progress: 0,
        ...(extraTransition?.leave(datum) ?? {}),
      }),
      update: (datum: TDatum) => ({
        progress: 1,
        ...(extraTransition?.update(datum) ?? {}),
      }),
    }),
    [extraTransition]
  );

export const useRectsTransition = <
  TDatum extends DatumWithRectAndColor,
  TExtraProps = unknown,
  TProps extends TExtraProps & { progress: number } = TExtraProps & {
    progress: number;
  }
>(
  data: TDatum[],
  extra?: TransitionExtra<TDatum, TExtraProps>
): {
  transition: TransitionFn<TDatum, PickAnimated<TProps>>;
} => {
  const { animate, config: springConfig } = useMotionConfig();

  const phases = useRectExtraTransition<TDatum, TExtraProps>(extra);

  const transition = useTransition<TDatum, TProps>(data, {
    config: springConfig,
    enter: phases.update,
    from: phases.enter,
    immediate: !animate,
    initial: phases.update,
    keys: (datum) => datum.id,
    leave: phases.leave,
  });

  return { transition };
};
