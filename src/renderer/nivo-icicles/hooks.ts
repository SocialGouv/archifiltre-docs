import type { InheritedColorConfig } from "@nivo/colors";
import { useInheritedColor, useOrdinalColorScale } from "@nivo/colors";
import { usePropertyAccessor, useTheme, useValueFormatter } from "@nivo/core";
import type { HierarchyRectangularNode } from "d3-hierarchy";
import {
  hierarchy as d3Hierarchy,
  partition as d3Partition,
} from "d3-hierarchy";
import cloneDeep from "lodash/cloneDeep";
import sortBy from "lodash/sortBy";
import { useMemo } from "react";

import type { Rect } from "./nivo-rects/types";
import { defaultIciclesProps } from "./props";
import type {
  DataProps,
  DatumId,
  IciclesCommonProps,
  IciclesComputedDatum,
  IciclesCustomLayerProps,
} from "./types";

const hierarchyRectUseX = <TDatum>(d: HierarchyRectangularNode<TDatum>) =>
  d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);

const hierarchyRectUseY = <TDatum>(d: HierarchyRectangularNode<TDatum>) =>
  d.y1 - d.y0 - Math.min(1, (d.y1 - d.y0) / 2);

const widthHeight = <TDatum>(d: HierarchyRectangularNode<TDatum>) => ({
  leftRight: () => ({
    height: hierarchyRectUseX(d),
    width: hierarchyRectUseY(d),
  }),
  topBottom: () => ({
    height: hierarchyRectUseY(d),
    width: hierarchyRectUseX(d),
  }),
});

interface UseIciclesProps<TRawDatum> {
  childColor?: IciclesCommonProps<TRawDatum>["childColor"];
  colorBy?: IciclesCommonProps<TRawDatum>["colorBy"];
  colors?: IciclesCommonProps<TRawDatum>["colors"];
  data: DataProps<TRawDatum>["data"];
  direction: IciclesCommonProps<TRawDatum>["direction"];
  height: IciclesCommonProps<TRawDatum>["height"];
  id?: DataProps<TRawDatum>["id"];
  inheritColorFromParent?: IciclesCommonProps<TRawDatum>["inheritColorFromParent"];
  value?: DataProps<TRawDatum>["value"];
  valueFormat?: DataProps<TRawDatum>["valueFormat"];
  width: IciclesCommonProps<TRawDatum>["width"];
}

interface UseIciclesReturn<TRawDatum> {
  nodes: IciclesComputedDatum<TRawDatum>[];
}

export const useIcicles = <TRawDatum>({
  data,
  id = defaultIciclesProps.id,
  value = defaultIciclesProps.value,
  valueFormat,
  colors = defaultIciclesProps.colors,
  colorBy = defaultIciclesProps.colorBy,
  inheritColorFromParent = defaultIciclesProps.inheritColorFromParent,
  childColor = defaultIciclesProps.childColor as InheritedColorConfig<
    IciclesComputedDatum<TRawDatum>
  >,
  width,
  height,
  direction,
}: UseIciclesProps<TRawDatum>): UseIciclesReturn<TRawDatum> => {
  const theme = useTheme();
  const getColor = useOrdinalColorScale<
    Omit<IciclesComputedDatum<TRawDatum>, "color" | "fill">
  >(colors, colorBy);
  const getChildColor = useInheritedColor<IciclesComputedDatum<TRawDatum>>(
    childColor,
    theme
  );

  const isLeftRight = direction === "left" || direction === "right";

  const getId = usePropertyAccessor<TRawDatum, DatumId>(id);
  const getValue = usePropertyAccessor<TRawDatum, number>(value);
  const formatValue = useValueFormatter<number>(valueFormat);

  // https://observablehq.com/@d3/zoomable-icicle
  const nodes: IciclesComputedDatum<TRawDatum>[] = useMemo(() => {
    // d3 mutates the data for performance reasons,
    // however it does not work well with reactive programming,
    // this ensures that we don't mutate the input data
    const clonedData = cloneDeep(data);

    const hierarchy = d3Hierarchy(clonedData)
      .sum(getValue)
      .sort((a, b) => b.height - a.height || b.value! - a.value!);

    const partition = d3Partition<TRawDatum>().size(
      isLeftRight ? [height, width] : [width, height]
    );
    // exclude root node
    const descendants = partition(hierarchy).descendants();

    const total = hierarchy.value ?? 0;

    // It's important to sort node by depth,
    // it ensures that we assign a parent node
    // which has already been computed, because parent nodes
    // are going to be computed first
    const sortedNodes = sortBy(descendants, "depth");

    const rootRect = {
      ...widthHeight(sortedNodes[0])[isLeftRight ? "leftRight" : "topBottom"](),
    };

    return sortedNodes.reduce<IciclesComputedDatum<TRawDatum>[]>(
      (acc, descendant) => {
        const descId = getId(descendant.data);
        // d3 hierarchy node value is optional by default as it depends on
        // a call to `count()` or `sum()`, and we previously called `sum()`,
        // d3 typings could be improved and make it non optional when calling
        // one of those.

        const descValue = descendant.value!;
        const percentage = (100 * descValue) / total;
        const path = descendant
          .ancestors()
          .map((ancestor) => getId(ancestor.data));

        const transform = {
          bottom: `translate(${descendant.x0}, ${descendant.y0})`,
          left: `translate(${width - rootRect.width - descendant.y0}, ${
            descendant.x0
          })`,
          right: `translate(${descendant.y0}, ${descendant.x0})`,
          top: `translate(${descendant.x0}, ${
            height - rootRect.height - descendant.y0
          })`,
        }[direction];

        const rect: Rect = {
          ...widthHeight(descendant)[isLeftRight ? "leftRight" : "topBottom"](),
          transform,
        };

        let parent: IciclesComputedDatum<TRawDatum> | undefined = void 0;
        if (descendant.parent) {
          // as the parent is defined by the input data, and we sorted the data
          // by `depth`, we can safely assume it's defined.

          parent = acc.find(
            (node) => node.id === getId(descendant.parent!.data)
          );
        }

        const normalizedNode: IciclesComputedDatum<TRawDatum> = {
          color: "",
          data: descendant.data,
          depth: descendant.depth,
          formattedValue: valueFormat
            ? formatValue(descValue)
            : `${percentage.toFixed(2)}%`,
          height: descendant.height,
          id: descId,
          path,
          percentage,
          rect,
          transform,
          value: descValue,
        };

        if (inheritColorFromParent && parent && normalizedNode.depth > 1) {
          normalizedNode.color = getChildColor(parent, normalizedNode);
        } else {
          normalizedNode.color = getColor(normalizedNode);
        }

        // normalizedNode.color = getColor(normalizedNode);

        return [...acc, normalizedNode];
      },
      []
    );
  }, [
    data,
    getValue,
    getId,
    valueFormat,
    formatValue,
    getColor,
    inheritColorFromParent,
    getChildColor,
    width,
    height,
    direction,
    isLeftRight,
  ]);

  return { nodes };
};

/**
 * Memoize the context to pass to custom layers.
 */
export const useIciclesLayerContext = <TRawDatum>({
  nodes,
}: IciclesCustomLayerProps<TRawDatum>): IciclesCustomLayerProps<TRawDatum> =>
  useMemo(
    () => ({
      nodes,
    }),
    [nodes]
  );
