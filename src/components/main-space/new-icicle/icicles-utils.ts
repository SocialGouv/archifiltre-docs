import * as d3 from "d3";
export const VIEWBOX_WIDTH = 1000;
export const VIEWBOX_HEIGHT = 300;
export const TRANSITION_DURATION = 750;

type Dimensions = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};

export const getRectangleHeight = ({ x0, x1 }): number => {
  return x1 - x0 - Math.min(1, (x1 - x0) / 2);
};

export const getCurrentRect = (icicles, currentElementId) => {
  const rects = getAllRects(icicles);
  return rects.filter(({ data: { id } }) => id === currentElementId.data.id);
};

export const getAllRects = (icicles) =>
  d3.select(icicles.current).selectAll("rect");

export const getRectById = (icicles, rectId) => {
  const rects = getAllRects(icicles);
  return rects.filter(({ data: { id } }) => id === rectId);
};

export const format = d3.format(",d");

export const isLabelVisible = ({ x0, x1, y0, y1 }): boolean => {
  return y1 <= VIEWBOX_WIDTH && y0 >= 0 && x1 - x0 > 16;
};

export const dimensionsTarget: Record<string, Dimensions> = {};

export const getDimensions = (dimensions) =>
  dimensionsTarget[dimensions.data.id];

export const handleZoom = (_, currentRect, elements) => {
  let { root, cell, rect, title, subtitle } = elements;

  elements.focus =
    elements.focus === currentRect
      ? (currentRect = currentRect.parent)
      : currentRect;

  root.each((dimensions) => {
    dimensionsTarget[dimensions.data.id] = {
      x0:
        ((dimensions.x0 - currentRect.x0) / (currentRect.x1 - currentRect.x0)) *
        VIEWBOX_HEIGHT,
      x1:
        ((dimensions.x1 - currentRect.x0) / (currentRect.x1 - currentRect.x0)) *
        VIEWBOX_HEIGHT,
      y0: dimensions.y0 - currentRect.y0,
      y1: dimensions.y1 - currentRect.y0,
    };
  });

  const transition = cell
    .transition()
    .duration(TRANSITION_DURATION)
    .attr(
      "transform",
      (d: any) => `translate(${getDimensions(d).y0},${getDimensions(d).x0})`
    );

  rect
    .transition(transition)
    .attr("height", (d: any) => getRectangleHeight(getDimensions(d)));
  title
    .transition(transition)
    .attr("fill-opacity", (d: any) => +isLabelVisible(getDimensions(d)));
  subtitle
    .transition(transition)
    .attr("fill-opacity", (d: any) => +isLabelVisible(getDimensions(d)) * 0.7);
};
