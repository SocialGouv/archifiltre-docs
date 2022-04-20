import type { InheritedColorConfig } from "@nivo/colors";
import {
  // @ts-expect-error -- nivo dark mechanics
  bindDefs,
  Container,
  SvgWrapper,
  useDimensions,
} from "@nivo/core";
import type { ReactNode } from "react";
import React, { createElement, Fragment } from "react";

import { useIcicles, useIciclesLayerContext } from "./hooks";
import { RectLabelsLayer } from "./nivo-rects/rect_labels/RectLabelsLayer";
import { defaultIciclesProps } from "./props";
import { Rects } from "./Rects";
import type {
  IciclesComputedDatum,
  IciclesLayerId,
  IciclesSvgProps,
} from "./types";

type InnerIciclesProps<TRawDatum> = Partial<
  Omit<
    IciclesSvgProps<TRawDatum>,
    "animate" | "data" | "height" | "isInteractive" | "motionConfig" | "width"
  >
> &
  Pick<
    IciclesSvgProps<TRawDatum>,
    "data" | "height" | "isInteractive" | "width"
  >;

const InnerIcicles = <TRawDatum,>({
  data,
  id = defaultIciclesProps.id,
  value = defaultIciclesProps.value,
  valueFormat,
  layers = ["rects", "rectLabels"],
  colors = defaultIciclesProps.colors,
  colorBy = defaultIciclesProps.colorBy,
  inheritColorFromParent = defaultIciclesProps.inheritColorFromParent,
  childColor = defaultIciclesProps.childColor as InheritedColorConfig<
    IciclesComputedDatum<TRawDatum>
  >,
  borderWidth = defaultIciclesProps.borderWidth,
  borderColor = defaultIciclesProps.borderColor,
  margin: partialMargin,
  width,
  height,
  enableRectLabels = defaultIciclesProps.enableRectLabels,
  rectLabelsTextColor = defaultIciclesProps.rectLabelsTextColor,
  defs = defaultIciclesProps.defs,
  fill = defaultIciclesProps.fill,
  isInteractive = defaultIciclesProps.isInteractive,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  tooltip = defaultIciclesProps.tooltip,
  role = defaultIciclesProps.role,
  rectLabel = defaultIciclesProps.rectLabel,
  rectLabelsComponent,
  direction = defaultIciclesProps.direction,
}: InnerIciclesProps<TRawDatum>) => {
  const { margin, outerHeight, outerWidth } = useDimensions(
    width,
    height,
    partialMargin
  );

  const { nodes } = useIcicles({
    childColor,
    colorBy,
    colors,
    data,
    direction,
    height,
    id,
    inheritColorFromParent,
    value,
    valueFormat,
    width,
  });

  const boundDefs = bindDefs(defs, nodes, fill, {
    colorKey: "color",
    dataKey: ".",
    targetKey: "fill",
  });

  const layerById: Record<IciclesLayerId, ReactNode> = {
    rectLabels: null,
    rects: null,
  };

  if (layers.includes("rects")) {
    layerById.rects = (
      <Rects<TRawDatum>
        key="rects"
        data={nodes}
        borderWidth={borderWidth}
        borderColor={borderColor}
        isInteractive={isInteractive}
        tooltip={tooltip}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      />
    );
  }

  if (enableRectLabels && layers.includes("rectLabels")) {
    layerById.rectLabels = (
      <RectLabelsLayer<IciclesComputedDatum<TRawDatum>>
        key="rectLabels"
        data={nodes}
        label={rectLabel}
        textColor={rectLabelsTextColor}
        component={rectLabelsComponent}
      />
    );
  }

  const layerContext = useIciclesLayerContext<TRawDatum>({
    nodes,
  });

  return (
    <SvgWrapper
      width={outerWidth}
      height={outerHeight}
      defs={boundDefs}
      margin={margin}
      role={role}
    >
      {layers.map((layer, i) => {
        if (layerById[layer as IciclesLayerId] !== undefined) {
          return layerById[layer as IciclesLayerId];
        }

        if (typeof layer === "function") {
          return (
            <Fragment key={i}>{createElement(layer, layerContext)}</Fragment>
          );
        }

        return null;
      })}
    </SvgWrapper>
  );
};

export const Icicles = <TRawDatum,>({
  isInteractive = defaultIciclesProps.isInteractive,
  animate = defaultIciclesProps.animate,
  motionConfig = defaultIciclesProps.motionConfig,
  theme,
  renderWrapper,
  ...otherProps
}: Partial<Omit<IciclesSvgProps<TRawDatum>, "data" | "height" | "width">> &
  Pick<
    IciclesSvgProps<TRawDatum>,
    "data" | "height" | "width"
  >): JSX.Element => (
  <Container
    {...{ animate, isInteractive, motionConfig, renderWrapper, theme }}
  >
    <InnerIcicles<TRawDatum> isInteractive={isInteractive} {...otherProps} />
  </Container>
);
