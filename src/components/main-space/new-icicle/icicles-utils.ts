import { difference } from "lodash";
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

export const OPACITY_05 = 0.5;
export const OPACITY_075 = 0.75;
export const OPACITY_1 = 1;

export const getRectangleHeight = ({ x0, x1 }): number => {
  return x1 - x0 - Math.min(1, (x1 - x0) / 2);
};

export const getAllRects = () => d3.selectAll("rect");

export const getCurrentRect = (currentElementId) =>
  d3.selectAll("rect").filter(({ data: { id } }) => id === currentElementId);

export const getRectById = (rectId) => d3.select(`rect[id='${rectId}']`);

export const getAncestorsPath = (id, treeDepth) => {
  const currentRect = getCurrentRect(id).data()[0];
  let temporaryRect = currentRect;
  let allAncestorsPath = [];
  let numberLoop = 0;

  while (temporaryRect.parent && numberLoop <= treeDepth) {
    allAncestorsPath.push(temporaryRect.data.virtualPath);
    temporaryRect = temporaryRect.parent;

    numberLoop++;
  }

  return allAncestorsPath;
};

export const switchMultipleOpacity = (paths: string[], opacity: number): void =>
  paths.forEach((path) => changeRectColor(path, opacity));

export const switchOpacityDifferences = (
  oldPaths: string[],
  newPaths: string[],
  emptyOpacity: number,
  fillOpacity: number
) => {
  const removeOpacity = difference(oldPaths, newPaths);
  const addOpacity = difference(newPaths, oldPaths);
  switchMultipleOpacity(removeOpacity, emptyOpacity);
  switchMultipleOpacity(addOpacity, fillOpacity);
};

export const getAncestors = (node) => {
  if (!node.parent) return [];
  return [node.parent, ...getAncestors(node.parent)];
};

export const getPathDifference = (paths1, paths2) =>
  paths1.filter((path) => !paths2.includes(path));

export const changeRectColor = (rectId, color) =>
  getRectById(rectId).style("opacity", color);

export const resetRectsColor = (paths) =>
  paths.map((path) => changeRectColor(path, OPACITY_05));

export const switchRectColor = (
  previousRects,
  nextRects,
  eventType: string
) => {
  const TYPE = eventType === "hover" ? OPACITY_075 : OPACITY_1;

  previousRects.map((rectId) => changeRectColor(rectId, OPACITY_05));
  nextRects.map((rectId) => changeRectColor(rectId, TYPE));
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
