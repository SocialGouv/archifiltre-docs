import React, { FC, useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  FilesAndFolders,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { ROOT_FF_ID } from "reducers/files-and-folders/files-and-folders-selectors";
import { FOLDER_COLOR, fromFileName } from "util/color/color-util";
import { Dimensions, IcicleOrientation } from "./icicle-types";
import { horizontalConfig, verticalConfig } from "./icicles-config";

type IciclesProps = {
  filesAndFolders: FilesAndFoldersMap;
  treeDepth: number;
  icicleOrientation: IcicleOrientation;
};

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 300;
const TRANSITION_DURATION = 750;

const Icicles: FC<IciclesProps> = ({
  filesAndFolders,
  treeDepth,
  icicleOrientation,
}) => {
  const iciclesRef = useRef(null);

  const {
    getRectangleHeight,
    getRectangleWidth,
    getRectangleX,
    getRectangleY,
    getViewboxWidth,
    getViewboxHeight,
  } =
    icicleOrientation === IcicleOrientation.HORIZONTAL
      ? horizontalConfig
      : verticalConfig;

  const isLabelVisible = ({ x0, x1, y0, y1 }): boolean => {
    return y1 <= VIEWBOX_WIDTH && y0 >= 0 && x1 - x0 > 16;
  };

  const partition = () => {
    const root = d3
      .hierarchy<FilesAndFolders>(
        filesAndFolders[filesAndFolders[ROOT_FF_ID].children[0]],
        (element) =>
          element?.children.map((childId) => filesAndFolders[childId]) ?? []
      )
      .sum((d) => d?.file_size ?? 0);

    return d3.partition<FilesAndFolders>().size([
      getViewboxHeight({
        rootElementHeight: root.height,
        treeDepth,
        viewboxHeight: VIEWBOX_HEIGHT,
      }),
      getViewboxWidth({
        rootElementHeight: root.height,
        treeDepth,
        viewboxWidth: VIEWBOX_WIDTH,
      }),
    ])(root);
  };

  const root = partition();

  let focus = root;

  useEffect(() => {
    const onClicked = (event, p) => {
      focus = focus === p ? (p = p.parent) : p;

      const dimensionsTarget: Record<string, Dimensions> = {};

      const getDimensions = (dimensions) =>
        dimensionsTarget[dimensions.data.id];

      root.each((dimensions) => {
        dimensionsTarget[dimensions.data.id] = {
          x0: ((dimensions.x0 - p.x0) / (p.x1 - p.x0)) * VIEWBOX_HEIGHT,
          x1: ((dimensions.x1 - p.x0) / (p.x1 - p.x0)) * VIEWBOX_HEIGHT,
          y0: dimensions.y0 - p.y0,
          y1: dimensions.y1 - p.y0,
        };
      });

      const transition = cell
        .transition()
        .duration(TRANSITION_DURATION)
        .attr(
          "transform",
          (d) => `translate(${getDimensions(d).y0},${getDimensions(d).x0})`
        );

      rect
        .transition(transition)
        .attr("height", (d) => getRectangleHeight(getDimensions(d)));

      text
        .transition(transition)
        .attr("fill-opacity", (d) => +isLabelVisible(getDimensions(d)));
    };

    const svg = d3
      .select(iciclesRef.current)
      .append("svg")
      .attr("viewBox", [0, 0, VIEWBOX_WIDTH, VIEWBOX_HEIGHT].join(" "))
      .style("font", "10px Quicksand");

    const cell = svg
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr(
        "transform",
        (d) => `translate(${getRectangleX(d)},${getRectangleY(d)})`
      );

    const rect = cell
      .append("rect")
      .attr("width", getRectangleWidth)
      .attr("height", getRectangleHeight)
      .attr("fill-opacity", 0.6)
      .attr("fill", (d) => {
        if (d.data.children.length > 0) {
          return FOLDER_COLOR;
        }
        return fromFileName(d.data.name);
      })
      .style("cursor", "pointer")
      .on("click", onClicked);

    const text = cell
      .append("text")
      .style("user-select", "none")
      .attr("pointer-events", "none")
      .attr("x", 4)
      .attr("y", 13)
      .attr("fill-opacity", (d) => +isLabelVisible(d));

    text.append("tspan").text((d) => d.data.name);

    cell.append("title").text(
      (d) =>
        `${d
          .ancestors()
          .map((d: any) => d.data.name)
          .reverse()}`
    );
  }, []);

  return <svg ref={iciclesRef} width="100%" height="80%" />;
};

export default Icicles;
